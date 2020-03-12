const graphqlGot = require('graphql-got');
const omegaOled = require('onion-omega-oled');

// The region from which you want to display stats
const region = 'Poland';

const query = `{
    locations {
        region
        confirmed
        recovered
        deaths
    }
}`;

(async () => {
	try {
		let stats = {
			confirmed: undefined,
			recovered: undefined,
			deaths: undefined
		};

		const response = await graphqlGot('https://coronavirusapi.me/', {query});
		const data = response.body.locations.filter(object => object.region === region);

		// eslint-disable-next-line array-callback-return
		await data.map(element => {
			stats = {
				confirmed: element.confirmed,
				recovered: element.recovered,
				deaths: element.deaths
			};
		});

		omegaOled.init().then(() => {
			omegaOled.write(`Status for ${region}:`);
			setTimeout(() => {
				omegaOled.cursor(2, 0);	
			}, 1000);
			omegaOled.write(`Confirmed: ${stats.confirmed}`);
			setTimeout(() => {
				omegaOled.cursor(3, 0);	
			}, 1000);
			omegaOled.write(`Recovered: ${stats.recovered}`);
			setTimeout(() => {
				omegaOled.cursor(4, 0);
			}, 1000);
			omegaOled.write(`Deaths: ${stats.deaths}`);
		});
	} catch (error) {
		console.log(error.response.body);
	}
})();
