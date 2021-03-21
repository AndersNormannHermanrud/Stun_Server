app.component('onlineUsers-list', {
    props: {
        users: {
            type: Array,
            required: true
        }
    },
    template:
    /*html*/
        `
  <div class="undefined">//TODO make fitting css class
  <h3>Online users:</h3>
    <ul>
      <li v-for="(user, index) in users" :key="index">
        //TODO list usernames
      </li>
    </ul>
  </div>
`
})