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
            error: null,
            userSelection: null,
            genderFilter: '',
            seasonFilter: '',
            maxPrice: 0,
            garments: [],

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
            filterData() {
                try {
                    console.log(this.genderFilter);
                    fetch(`/api/garments?gender=${this.genderFilter}&season=${this.seasonFilter}`)
                        .then(filtered => filtered.json())
                        .then(myData => {
                            console.log(myData);
                            this.garments = myData.data
                        })
                        .catch(error =>  new Error(error.message))

                } catch {
                    this.error(error.message)
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
