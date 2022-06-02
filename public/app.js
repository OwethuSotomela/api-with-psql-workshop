document.addEventListener("alpine:init", () => {
    Alpine.data("users", () => {
        return {
            init() {
                this.getAllGarments();
            },

            // State 
            open: false,
            username: null,
            isAuthenticated: false,
            user: null,
            authError: null,
            authErrorShow: false,
            error: null,

            // Again 
            feedback: '',
            empty: 'Enter a garment to be added on the database',
            success: 'Garment successfully added',
            removed: 'Garment removed from the list',
            token: null,
            // Here 
            userSelection: null,
            isOpen: false,
            genderFilter: '',
            seasonFilter: '',
            maxPrice: 0,

            // let me see 
            item: ({
                description: '',
                img: '',
                season: '',
                gender: '',
                price: 0.00,
            }),
            // end 

            garments: [],

            //  Methods 
            async login() {
                try {
                    const login_req = await fetch('/api/login', {
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
            getToken() {
                try {
                    const username = this.username;
                    axios
                        .post('/api/login', { username })
                        .then((myData) => {
                            console.log(myData.data)
                            var { access_token } = myData.data;
                            this.parseJwt()
                            this.token = setTimeout(() => {
                                JSON.stringify(this.parseJwt(access_token))
                            }, 2000);

                            // this.garments = JSON.stringify(this.parseJwt(access_token));
                            console.log(access_token);
                        })
                } catch {

                }
            },
            parseJwt: (access_token) => {
                try {
                    return JSON.parse(atob(access_token.split('.')[1]));
                } catch (e) {
                    return null;
                }
            },
            showAuthError(message) {
                this.authError = message;
                this.authErrorShow = true;
            },
            async getAllGarments() {

                try {
                    const garments_req = await fetch('/api/garments', {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const garments_res = await garments_req.json();

                    if (garments_res?.data) this.garments = garments_res.data;

                } catch (error) {
                    this.showAuthError(error.message);
                }

            },
            filterData() {
                try {
                    fetch(`/api/garments?gender=${this.genderFilter}&season=${this.seasonFilter}`)
                        .then(filtered => filtered.json())
                        .then(myData => {
                            console.log(myData);
                            this.garments = myData.data
                        })
                        .catch(error => new Error(error.message))

                } catch {
                    this.error(error.message)
                }
            },
            getMaxPrice() {
                try {
                    console.log(this.maxPrice)
                    console.log(`/api/garments/${this.maxPrice}`)
                    fetch(`/api/garments/${this.maxPrice}`)
                        .then(filteredAmount => filteredAmount.json())
                        .then(myData => {
                            console.log(myData)
                            this.garments = myData.data
                        })
                        .catch(error => new Error(error.message))
                } catch {
                    this.error(error.message)
                }
            },
            addTab() {
                console.log('Open?')
                this.isOpen = true
                return;
            },
            hideTab() {
                console.log('hide?')
                this.isOpen = !this.isOpen
                return;
            },
            addGarment() {
                try {
                    const myItems = this.item
                    if (
                        this.item.description == "" ||
                        this.item.gender == "" ||
                        this.item.img == "" ||
                        this.item.price == 0 ||
                        this.item.season == ""
                    ) {
                        // this.feedback = this.empty
                        setTimeout(() => {
                            this.feedback = this.empty
                        }, 2000)
                    } else {
                        axios
                            .post('/api/garment', myItems)
                            .then(() => this.getAllGarments())
                        setTimeout(() => {
                            this.feedback = this.success
                        }, 2000)
                    }

                } catch {
                }
            },
            getMyGarments() {
                try {
                    fetch('/api/gaments')
                        .then(allItems => allItems.json())
                        .then(myData => {
                            setTimeout(() => {
                                this.garments = myData.data
                            }, 2000)
                        })
                } catch {

                }
            },
            deleteGarments(myGarm) {
                try {
                    axios
                        .delete(`/api/garment/${myGarm.id}`)
                        .then(() => this.getAllGarments())
                    setTimeout(() => {
                        this.feedback = this.removed
                    }, 2000)
                } catch {

                }
            },

            logout() {
                console.log('Bye?')
                setTimeout(() => {
                    this.isAuthenticated = !this.isAuthenticated
                }, 2000)
            }
        };

    });
});
