#!/usr/bin/env python3
"""
Script to update variant numbers in JSONL files.
Renumbers variants sequentially starting from 1.
"""

import json
import sys
import argparse
from pathlib import Path


def update_variants(input_file: str, output_file: str = None, in_place: bool = False):
    """
    Update variant numbers in a JSONL file to be sequential starting from 1.
    
    Args:
        input_file: Path to the input JSONL file
        output_file: Path to the output JSONL file (if not in-place)
        in_place: If True, overwrite the input file
    """
    input_path = Path(input_file)
    
    if not input_path.exists():
        print(f"Error: File '{input_file}' does not exist.")
        sys.exit(1)
    
    if not input_path.is_file():
        print(f"Error: '{input_file}' is not a file.")
        sys.exit(1)
    
    # Read all entries
    entries = []
    with open(input_path, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            
            try:
                entry = json.loads(line)
                entries.append(entry)
            except json.JSONDecodeError as e:
                print(f"Warning: Skipping invalid JSON on line {line_num}: {e}")
                continue
    
    if not entries:
        print(f"Error: No valid entries found in '{input_file}'.")
        sys.exit(1)
    
    # Update variant numbers
    for idx, entry in enumerate(entries, start=1):
        entry['variant'] = idx
    
    # Determine output file
    if in_place:
        output_path = input_path
        backup_path = input_path.with_suffix(input_path.suffix + '.bak')
        
        # Create backup
        print(f"Creating backup: {backup_path}")
        with open(backup_path, 'w', encoding='utf-8') as f:
            with open(input_path, 'r', encoding='utf-8') as src:
                f.write(src.read())
    else:
        output_path = Path(output_file) if output_file else input_path.with_suffix('.updated' + input_path.suffix)
    
    # Write updated entries
    print(f"Writing {len(entries)} entries to '{output_path}'...")
    with open(output_path, 'w', encoding='utf-8') as f:
        for entry in entries:
            f.write(json.dumps(entry, ensure_ascii=False) + '\n')
    
    print(f"Successfully updated variants from 1 to {len(entries)}")
    if in_place:
        print(f"Original file backed up to: {backup_path}")


def main():
    parser = argparse.ArgumentParser(
        description='Update variant numbers in JSONL files to be sequential starting from 1.'
    )
    parser.add_argument(
        'input_file',
        type=str,
        help='Path to the input JSONL file'
    )
    parser.add_argument(
        '-o', '--output',
        type=str,
        default=None,
        help='Path to the output JSONL file (default: input_file.updated.jsonl)'
    )
    parser.add_argument(
        '-i', '--in-place',
        action='store_true',
        help='Update the file in-place (creates a backup)'
    )
    
    args = parser.parse_args()
    
    update_variants(args.input_file, args.output, args.in_place)


if __name__ == '__main__':
    main()

