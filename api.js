module.exports = function (app, db) {

	app.get('/api/test', function (req, res) {
		res.json({
			name: 'joe'
		});
	});

	app.get('/api/garments', async function (req, res) {

		// add some sql queries that filter on gender & season

		const { gender, season } = req.query;
		let garments = await db.manyOrNone(`SELECT * FROM garment`);
		if (season) {
			garments = await db.manyOrNone(`SELECT * FROM garment WHERE season = $1`, [season])
		}
		if (gender) {
			garments = await db.manyOrNone(`SELECT * FROM garment WHERE gender = $1`, [gender])
		}
		if (gender && season) {
			garments = await db.manyOrNone(`SELECT * FROM garment WHERE gender = $1 AND season = $2`, [gender, season])
		}

		console.log(garments);

		res.json({
			data: garments
		})
	});

	app.put('/api/garment/:id', async function (req, res) {

		try {

			// use an update query...

			const { id } = req.params;
			const garment = await db.one(`select * from garment where id = $1`, [id]);

			// you could use code like this if you want to update on any column in the table
			// and allow users to only specify the fields to update

			let params = { ...garment, ...req.body };
			const { description, price, img, season, gender } = params;

			await db.none(`UPDATE garment SET gender = $1, description = $2, price = $3, img = $4, season = $5 WHERE id = $6`, [gender, description, price, img, season, id])

			res.json({
				status: 'success'
			})
		} catch (err) {
			console.log(err);
			res.json({
				status: 'error',
				error: err.message
			})
		}
	});

	app.get('/api/garment/:id', async function (req, res) {

		try {
			const { id } = req.params;
			// get the garment from the database
			const garment = await db.one(`SELECT * FROM garment WHERE id = $1`, [id]);

			res.json({
				status: 'success',
				data: garment
			});

		} catch (err) {
			console.log(err);
			res.json({
				status: 'error',
				error: err.message
			})
		}
	});

	app.post('/api/garment', async function (req, res) {

		try {

			const { description, price, img, season, gender } = req.body;

			// insert a new garment in the database
			await db.none(`INSERT INTO garment( description, price, img, season, gender) VALUES ($1,$2,$3,$4,$5)`, [description, price, img, season, gender]);

			res.json({
				status: 'success',

			});

		} catch (err) {
			console.log(err);
			res.json({
				status: 'error',
				error: err.message
			})
		}
	});

	app.get('/api/garments/grouped', async function (req, res) {
		const result = await db.many(`SELECT COUNT(*), gender FROM garment GROUP BY gender ORDER BY COUNT ASC`);

		res.json({
			data: result
		})
	});

	app.get('/api/garments/:price', async function (req, res) {
		try {
			const { price } = req.params
			const result = await db.manyOrNone(`SELECT * FROM garment WHERE price <= $1`, [price])
			res.json({
				data: result
			})
		} catch {
			res.json({
				status: 'error'
			})
		}
	})

	app.delete('/api/garment/:id', async function (req, res) {

		try {
			const { id } = req.params;
			// delete the garments with the specified id
			const result = await db.one(`DELETE FROM garment WHERE id = $1`, [id])

			res.json({
				status: 'success',
				data: result
			})
		} catch (err) {
			res.json({
				status: 'success',
				error: err.stack
			})
		}

	})

}