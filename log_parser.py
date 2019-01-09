import json
if __name__ == '__main__':
	file = open('logs.json')
	lines = file.readlines()
	print("All content\n")
	print(lines)
	print('\n')

	#lines[0].strip()
	oscillate = 0;
	count = 0
	for i in lines:
		if count % 2 == 0:
			if oscillate == 0:
				print('------')
				print('Date:')			
				print(i.rstrip()+'\n')
				oscillate = 1
			else:
				print('Content:')			
				print(i.strip()+'\n')
				converted = json.loads(i)
				print("Input:")
				if 'text' in converted['input']:
					print(converted['input']['text'])
				else:
					print(converted['input'])
				print("\nOutput:")
				print(converted['output']['text'][0])
				oscillate = 0
		count = count + 1	
