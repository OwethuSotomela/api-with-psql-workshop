document.addEventListener("alpine:init", () => {
    Alpine.data("users", () => {
        return {
            init() {
                // fetch("https://jsonplaceholder.typicode.com/users")
                //     .then((r) => r.json())
                //     .then((userData) => (this.users = userData));
                console.log('Hi Oz!')
            },
            open: false,
            users: [
                {
                    username: "OwethuSotomela",
                },
            ],
            logMe() {
                alert("Right direction");
            },
            getToken(){
                alert("Right direction to get my token")
            }
        };
    });
});

