app.component('Client',{
    props:{
        ip: String,
        name: String
    },
    template: {},
    methods: {
        Client(ip,name){
            this.ip = ip;
            this.name = name;
        }
    }
})