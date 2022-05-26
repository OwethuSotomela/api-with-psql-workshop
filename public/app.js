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
            addGarmentTab() {
                console.log('Open?')
                this.isOpen = true
                return;
            },
            hideTab() {
                console.log('hide?')
                this.isOpen = ! this.isOpen
                return;
            },
            addGarment() {
                try {
                    const myItems = this.item
                    axios
                        .post('/api/garment', myItems)
                        .catch(error => new Error(error.message))
                } catch {
                    this.error(error.message)
                }
            },
            logout() {
                this.isAuthenticated = false
            }
        };

    });
});
