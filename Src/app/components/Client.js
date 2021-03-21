app.component('Client',{
    props:{
        ip: String,
        name: String
    },
    template: {},
    methods: {
        constructor(ip,name){
            this.ip = ip;
            this.name = name;
        }
    }
})