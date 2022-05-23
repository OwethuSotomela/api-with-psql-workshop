document.addEventListener("alpine:init", () => {
    Alpine.data("users", () => {
        return {

            // State 
            open: false,
            username: null,
            isAuthenticated: false,
            user: null,
            authError: null,
            authErrorShow: false,
            garments: [
                {
                    // gender: '',
                    // season: '',
                    // price: ''
                }
            ],

            //  Methods 
            async login() {
                try {
                    const login_req = await fetch('http://localhost:4009/api/login', {
                        method: 'POST',
                        body: JSON.stringify({ username: this.username }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const login_res = await login_req.json();

                    if (login_res?.success) {
                        this.authErrorShow = false;
                        this.isAuthenticated = true;
                        this.user = login_res.user;
                        localStorage.setItem('access_token', login_res.access_token);
                        this.getAllGarments();
                        console.log(this.garments);
                        return;
                    }

                    this.showAuthError("Oops! Failed to login");

                } catch (error) {
                    this.showAuthError(error.message);
                }
            },
            showAuthError(message) {
                this.authError = message;
                this.authErrorShow = true;
            },
            async getAllGarments() {

                try {
                    const garments_req = await fetch('http://localhost:4009/api/garments', {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const garments_res = await garments_req.json();

                    if (garments_res?.data) this.garments = garments_res.data;
                    // console.log(this.garments[0])

                } catch (error) {
                    this.showAuthError(error.message);
                }

            },
            async filterData() {
                try {
                    const filter = await fetch(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`)
                    // method: POST
                    console.log(filter)
                        .then(function (result) {
                            console.log(result)
                        })
                } catch {
                    this.showAuthError(error.message)
                }
            },
        };

    });
});

// function filterData() {
// 	axios
// 		.get(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`)
// 		.then(function (result) {
// 			searchResultsElem.innerHTML = garmentsTemplate({
// 				garments: result.data.garments
// 			})
// 		});
// }
