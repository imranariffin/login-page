function capitalizeFirstLetter (inputString) {
	stringArr = inputString.split(' ');

	for (i in stringArr) {
		word = stringArr[i];
		word = word[0].toUpperCase() + word.slice(1, word.length);

		stringArr[i] = word;
	}

	// convert back to string
	outputString = '';
	for (i in stringArr) {
		// consider case of space overflow
		if (i===0)
			outputString = stringArr[i];
		else
			outputString += ' ' + stringArr[i];
	}

	//remove 'space' at outputString[0]
	outputString = outputString.slice(1, outputString.length);

	return outputString;
}

exports.capitalizeFirstLetter = capitalizeFirstLetter;