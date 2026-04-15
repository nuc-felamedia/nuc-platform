#!/usr/bin/env python3
"""
NUC Accreditation PDF Parser
Usage: python3 parse_accreditation_pdf.py <pdf_file.pdf>

Install dependencies first:
  pip install pdfplumber pandas psycopg2-binary python-dotenv

This script extracts accreditation tables from NUC PDF documents
and outputs a clean CSV ready to import into PostgreSQL.
"""

import pdfplumber
import pandas as pd
import sys
import re
import os
from pathlib import Path

STATUS_MAP = {
    'full': 'FULL',
    'f': 'FULL',
    'interim': 'INTERIM',
    'i': 'INTERIM',
    'in': 'INTERIM',
    'denied': 'DENIED',
    'd': 'DENIED',
    'not accredited': 'DENIED',
    'pending': 'PENDING',
    'n/a': 'NOT_YET_ACCREDITED',
}

DEGREE_MAP = {
    'bsc': 'BSC', 'b.sc': 'BSC',
    'beng': 'BENG', 'b.eng': 'BENG',
    'llb': 'LLB', 'l.l.b': 'LLB',
    'mbbs': 'MBBS', 'mb.bs': 'MBBS',
    'bpharm': 'BPHARM', 'b.pharm': 'BPHARM',
    'ba': 'BA', 'b.a': 'BA',
    'btech': 'BTECH', 'b.tech': 'BTECH',
    'msc': 'MSC', 'm.sc': 'MSC',
    'mba': 'MBA', 'm.b.a': 'MBA',
    'phd': 'PHD', 'ph.d': 'PHD',
}

def normalize_status(raw: str) -> str:
    if not raw:
        return 'PENDING'
    clean = raw.strip().lower()
    for key, val in STATUS_MAP.items():
        if key in clean:
            return val
    return 'PENDING'

def normalize_degree(raw: str) -> str:
    if not raw:
        return 'BSC'
    clean = raw.strip().lower().replace('.', '').replace(' ', '')
    return DEGREE_MAP.get(clean, 'BSC')

def extract_year(raw: str) -> int | None:
    if not raw:
        return None
    match = re.search(r'20\d{2}', str(raw))
    return int(match.group()) if match else None

def parse_pdf(pdf_path: str) -> pd.DataFrame:
    rows = []
    current_university = None
    current_faculty = None

    print(f"📄 Parsing: {pdf_path}")

    with pdfplumber.open(pdf_path) as pdf:
        print(f"   Pages: {len(pdf.pages)}")

        for page_num, page in enumerate(pdf.pages, 1):
            # Extract text for university/faculty context
            text = page.extract_text() or ''
            lines = text.split('\n')

            for line in lines:
                # Detect university name lines (usually all caps or specific patterns)
                if re.match(r'^[A-Z][A-Z\s]+UNIVERSITY', line.strip()):
                    current_university = line.strip().title()
                elif re.match(r'^UNIVERSITY OF', line.strip(), re.I):
                    current_university = line.strip().title()
                # Detect faculty lines
                elif line.strip().lower().startswith('faculty of'):
                    current_faculty = line.strip().title()
                elif line.strip().lower().startswith('school of'):
                    current_faculty = line.strip().title()
                elif line.strip().lower().startswith('department of'):
                    current_faculty = line.strip().title()

            # Extract tables
            tables = page.extract_tables()
            for table in tables:
                if not table:
                    continue
                for row in table:
                    if not row or len(row) < 3:
                        continue
                    # Skip header rows
                    if row[0] and any(h in str(row[0]).lower() for h in ['s/n', 'sn', 'no.', 'programme', 'university']):
                        # Try to detect university from header
                        if current_university is None and row[0]:
                            text_check = ' '.join([str(c) for c in row if c])
                            uni_match = re.search(r'university of \w+', text_check, re.I)
                            if uni_match:
                                current_university = uni_match.group().title()
                        continue

                    # Parse row — typical columns: S/N | Programme | Status | Year | Expiry
                    cells = [str(c).strip() if c else '' for c in row]

                    program_name = None
                    status_raw = None
                    year_raw = None
                    expiry_raw = None

                    # Try to identify columns by content
                    for i, cell in enumerate(cells):
                        if not cell or cell in ['', 'None']:
                            continue
                        cell_lower = cell.lower()
                        # Program name — usually longest text cell without year
                        if len(cell) > 5 and not re.match(r'^\d+$', cell) and not any(s in cell_lower for s in ['full', 'interim', 'denied', 'pending']):
                            if program_name is None and not re.match(r'^[0-9]+\.?$', cell):
                                program_name = cell.strip()
                        # Status detection
                        if any(s in cell_lower for s in ['full', 'interim', 'denied', 'pending', 'not accredited']):
                            status_raw = cell
                        # Year detection
                        year_found = extract_year(cell)
                        if year_found:
                            if year_raw is None:
                                year_raw = year_found
                            else:
                                expiry_raw = year_found

                    if program_name and len(program_name) > 3:
                        rows.append({
                            'university': current_university or 'Unknown University',
                            'faculty': current_faculty or '',
                            'program': program_name,
                            'degree_type': normalize_degree(cells[2] if len(cells) > 2 else ''),
                            'status': normalize_status(status_raw or ''),
                            'year': year_raw,
                            'expiry_year': expiry_raw,
                            'page': page_num,
                        })

            if page_num % 10 == 0:
                print(f"   Processed page {page_num}/{len(pdf.pages)}...")

    df = pd.DataFrame(rows)
    print(f"✅ Extracted {len(df)} records")
    return df

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    # Remove duplicates
    df = df.drop_duplicates(subset=['university', 'program'])
    # Clean text
    df['university'] = df['university'].str.strip().str.title()
    df['program'] = df['program'].str.strip().str.title()
    df['faculty'] = df['faculty'].str.strip().str.title()
    # Fill missing years with current year
    import datetime
    current_year = datetime.datetime.now().year
    df['year'] = df['year'].fillna(current_year).astype(int)
    df = df[df['program'].str.len() > 3]
    df = df[~df['program'].str.lower().isin(['s/n', 'sn', 'no', 'programme', 'program'])]
    return df.reset_index(drop=True)

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 parse_accreditation_pdf.py <pdf_file.pdf> [output.csv]")
        print("Example: python3 parse_accreditation_pdf.py ug_accreditation_2024.pdf")
        sys.exit(1)

    pdf_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else pdf_path.replace('.pdf', '_parsed.csv')

    if not Path(pdf_path).exists():
        print(f"❌ File not found: {pdf_path}")
        sys.exit(1)

    df = parse_pdf(pdf_path)
    df = clean_dataframe(df)

    df.to_csv(output_path, index=False)
    print(f"\n📊 Results saved to: {output_path}")
    print(f"   Total records: {len(df)}")
    print(f"   Universities found: {df['university'].nunique()}")
    print(f"   Status breakdown:")
    print(df['status'].value_counts().to_string())
    print(f"\n✅ Next step: Run the CSV importer:")
    print(f"   npx ts-node scripts/import-csv.ts {output_path}")

if __name__ == '__main__':
    main()
