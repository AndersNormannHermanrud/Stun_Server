app.component('show-chat', {
    props: {
        chat: {
            type: Array,
            required: true
        }
    },
    template:
    /*html*/
        `

<div class="dialogue-display">

<h3> Chat:</h3>
    <ul>
    <li v-for="(msg, index) in chat" :key="index">
    {{ msg.userName }} sent {{ msg.text}}
</li>
</ul>

</div>`,

})