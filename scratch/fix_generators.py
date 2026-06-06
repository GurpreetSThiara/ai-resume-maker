import os
import re

dir_path = r'd:\nextjs\resume_builder_next\lib\pdf-generators'
files = [f for f in os.listdir(dir_path) if f.endswith('.ts')]

for filename in files:
    if filename == 'template-modern-split-generator.ts': continue # Keep local fix for now
    
    file_path = os.path.join(dir_path, filename)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Standardize calls
    content = content.replace('pdfWrapText', 'wrapText')
    
    # 2. Fix imports
    # First, remove any wrapText from @/lib/utils or ../utils
    content = re.sub(r'import \{(.*?)\} from [\'"](@/lib/utils|\.\./utils)[\'"]', 
                     lambda m: 'import {' + m.group(1).replace('wrapText', '').replace(', ,', ',').replace('{ ,', '{').replace(', }', '}').strip(', ') + '} from "../utils"', 
                     content)
    
    # Then add the correct wrapText import from ../pdf-utils if wrapText is used in the file
    if 'wrapText(' in content and 'import { wrapText } from "../pdf-utils"' not in content:
        content = 'import { wrapText } from "../pdf-utils"\n' + content

    # 3. Clean up empty imports
    content = content.replace('import {} from "../utils"\n', '')
    content = content.replace('import {  } from "../utils"\n', '')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
