app.component('DialogueDisplay', {
    props: {

    },
    template:
    /*html*/
        `
  <div class="dialogue-display">
    <div class="dialogue-container">
    //TODO add shit
      </div>
    </div>
    <onlineUsers-list v-if="users.length" :users="users"></onlineUsers-list>
  </div>`,
})