from get_letter import get_letter
from constants import ocr_path

# csvfile = open(src, 'r')
# reader = csv.reader(csvfile, delimiter='\t')
lines = []
letter = get_letter('helvetica.ttf', 'd').numpy()
for row in range(28):
  line = ''
  for col in range(28):
    line += str(letter[0][row][col]) + ' '
  lines.append(line)

file = open(ocr_path, "w") 
file.write('\n'.join(lines))
file.close() 