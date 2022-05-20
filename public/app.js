document.addEventListener('alpine:init', () => {
    Alpine.data('users', () => {
        return {
            init() {
                fetch('https://jsonplaceholder.typicode.com/users')
                    .then(r => r.json())
                    .then(userData => this.users = userData)
            },
            open: false,
            users: []
        }
    })
})


