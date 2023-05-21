/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from '@workadventure/scripting-api-extra'

console.log('Script started successfully')
console.log('hello world')

let currentPopup: any = undefined

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log('Scripting API ready')
    console.log('Player tags: ', WA.player.tags)

    const enterBobDesk = WA.room.area.onEnter('bobDesk').subscribe(() => {
      chatBobDesk()
    })
    WA.room.area.onEnter('bobDesk').subscribe(() => {
      WA.chat.open()
    })
    WA.room.area.onLeave('bobDesk').subscribe(() => {
      //   WA.chat.sendChatMessage('À bientôt!', 'Bob')
      WA.chat.close()
      enterBobDesk.unsubscribe()
    })

    // WA.room.area.onEnter('controlDoorIn').subscribe(() => {
    //   if (WA.player.state.access) {
    //     WA.room.setTiles([{ x: 13, y: 8, tile: 'emptyTileControlDoor', layer: 'collisions' }])
    //   }
    //   console.log('controlDoorIn')
    // })

    WA.room.area.onEnter('clock').subscribe(() => {
      const today = new Date()
      const time = today.getHours() + ':' + today.getMinutes()
      currentPopup = WA.ui.openPopup('clockPopup', "It's " + time, [])
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra()
      .then(() => {
        console.log('Scripting API Extra ready')
      })
      .catch((e) => console.error(e))
  })
  .catch((e) => console.error(e))

function closePopup() {
  if (currentPopup !== undefined) {
    currentPopup.close()
    currentPopup = undefined
  }
}

export {}

function chatBobDesk() {
  WA.chat.sendChatMessage('Bonjour 👋, bienvenue dans les bureaux virtuels de Constel Education.', 'Bob')
  WA.chat.sendChatMessage('Vous avez plusieurs commande disponible :', 'Bob')
  WA.chat.sendChatMessage('Pour prendre RDV -> /bob RDV', 'Bob')

  WA.chat.onChatMessage((message) => {
    if (message.toLowerCase() == '/bob rdv') {
      WA.chat.sendChatMessage('Voulez vous prendre rendez-vous avez Paul le CEO, Danny le CTO, ou Jennifer responsable média ?', 'Bob')
    }
    message = message.toLowerCase()
    if (message.includes('paul')) {
      WA.nav.openTab('https://calendly.com/paul-cartier-constel-education/rencontreconsteleducation')
      WA.chat.sendChatMessage("Vous pouvez réserver directement sur le Calendly de Paul, voici l'URL : https://calendly.com/paul-cartier-constel-education/rencontreconsteleducation", 'Bob')
    }
    if (message.includes('danny')) {
      WA.nav.openTab('https://calendly.com/danny-louveton/30min')
      WA.chat.sendChatMessage("Vous pouvez réserver directement sur le Calendly de Danny, voici l'URL : https://calendly.com/danny-louveton/30min", 'Bob')
    }
    if (message.includes('jennifer')) {
      WA.chat.sendChatMessage('Pour faire votre demande de rendez-vous envoyez un e-mail à jennifer.nguon@constel-education.com', 'Bob')
    }
    // if (message.toLocaleLowerCase().includes('/bob enter 1011')) {
    //   WA.player.state.access = true
    // }
    // if (message.toLocaleLowerCase().includes('/bob invite 1011')) {
    //   WA.players.configureTracking().then(() => {
    //     const players = WA.players.list()
    //     for (const player of players) {
    //       console.log(`Player ${player.name} is near you`)
    //       console.log(player.)
    //     }
    //   })
    // }
  })
}
