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

setInterval(async () => {
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
			omegaOled.chainMode(true);
			omegaOled.write(`Status for ${region}:`);
			omegaOled.cursor(2, 0);
			omegaOled.write(`Confirmed: ${stats.confirmed}`);
			omegaOled.cursor(3, 0);
			omegaOled.write(`Recovered: ${stats.recovered}`);
			omegaOled.cursor(4, 0);
			omegaOled.write(`Deaths: ${stats.deaths}`);
			omegaOled.executeChain();
		});
	} catch (error) {
		console.log(error.response.body);
	}
}, 300000);
