import { senators } from '../data/senators.js'
import { representatives } from '../data/representatives.js'
import { removeChildren } from '../utils/index.js'

const members = [...senators, ...representatives] // modern way to combine arrays... like a genius

const senatorDiv = document.querySelector('.senatorsDiv')
const seniorityHeading = document.querySelector('.seniority')
const congressGrid = document.querySelector('.congressGrid')
const loyaltyList = document.querySelector('.loyaltyList')
const seniorityButton = document.querySelector('#seniorityButton')
const birthdayButton = document.querySelector('#birthdayButton')

seniorityButton.addEventListener('click', () => {
  senioritySort()
})

birthdayButton.addEventListener('click', () => {
  birthdaySort()
})

function simplifiedSenators() {
  return senators.map(senator => {
    const middleName = senator.middle_name ? ` ${senator.middle_name} ` : ` `
    return {
      id: senator.id,
      name: `${senator.first_name}${middleName}${senator.last_name}`,
      party: senator.party,
      gender: senator.gender,
      imgURL: `https://www.govtrack.us/static/legislator-photos/${senator.govtrack_id}-100px.jpeg`,
      seniority: senator.seniority,
      missedVotesPct: senator.missed_votes_pct,
      loyaltyPct: senator.votes_with_party_pct
    }
  })
}

function simplifiedMembers(chamberFilter) {
  if(chamberFilter === "D" | chamberFilter === "R"){
    const filteredArray = members.filter(member => chamberFilter ? member.party === chamberFilter : member)
    return filteredArray.map(senator => {
      const middleName = senator.middle_name ? ` ${senator.middle_name} ` : ` `
      return {
        id: senator.id,
        name: `${senator.first_name}${middleName}${senator.last_name}`,
        party: senator.party,
        imgURL: `https://www.govtrack.us/static/legislator-photos/${senator.govtrack_id}-100px.jpeg`,
        gender: senator.gender,
        seniority: +senator.seniority,
        missedVotesPct: senator.missed_votes_pct,
        loyaltyPct: senator.votes_with_party_pct,
      }
    })
  }
  else{
    const filteredArray = members.filter(member => chamberFilter ? member.short_title === chamberFilter : member)
    return filteredArray.map(senator => {
      const middleName = senator.middle_name ? ` ${senator.middle_name} ` : ` `
      return {
        id: senator.id,
        name: `${senator.first_name}${middleName}${senator.last_name}`,
        party: senator.party,
        imgURL: `https://www.govtrack.us/static/legislator-photos/${senator.govtrack_id}-100px.jpeg`,
        gender: senator.gender,
        seniority: +senator.seniority,
        missedVotesPct: senator.missed_votes_pct,
        loyaltyPct: senator.votes_with_party_pct,
      }
    })
  }
}
const simpleSenators = simplifiedSenators()
function populateCongressGrid(simplePeople) {
  removeChildren(congressGrid)
  simplePeople.forEach(person => {
      let personDiv = document.createElement('div')
      personDiv.className = 'figureDiv'
      let personFig = document.createElement('figure')
      let figImg = document.createElement('img')
      let figCaption = document.createElement('figcaption')

      figImg.src = person.imgURL
      figCaption.textContent = `${person.name}`

      personFig.appendChild(figImg)
      personFig.appendChild(figCaption)
      personDiv.appendChild(personFig)
      congressGrid.appendChild(personDiv)
  })
}

function populateSenatorDiv(senatorArray) {
  senatorArray.forEach(senator => {
    const senFigure = document.createElement('figure')
    const figImg = document.createElement('img')
    const figCaption = document.createElement('figcaption')

    figImg.src = senator.imgURL
    figCaption.textContent = senator.name

    senFigure.appendChild(figImg)
    senFigure.appendChild(figCaption)
    senatorDiv.appendChild(senFigure)
  })
}

populateSenatorDiv(simpleSenators)

const mostSeniorMember = simplifiedSenators().reduce((acc, senator) => {
  return acc.seniority > senator.seniority ? acc : senator
})

const biggestMissedVotesPct = simplifiedSenators().reduce((acc, senator) => acc.missedVotesPct > senator.missedVotesPct ? acc : senator)

// console.log(biggestMissedVotesPct.missedVotesPct)

const biggestVacationerList = simplifiedSenators().filter(senator => senator.missedVotesPct === biggestMissedVotesPct.missedVotesPct).map(senator => senator.name).join(' and ')

// console.log(biggestVacationerList)

seniorityHeading.textContent = `The most senior member of the senate is ${mostSeniorMember.name} and the biggest vacationers are ${biggestVacationerList}`


simplifiedSenators().forEach(senator => {
  if(senator.loyaltyPct === 100) {
    let listItem = document.createElement('li')
    listItem.textContent = senator.name
    loyaltyList.appendChild(listItem)
  }
})

simplifiedMembers().forEach(senator => {
  if(senator.loyaltyPct === 50) {
    let listItem = document.createElement('li')
    listItem.textContent = senator.name
    loyaltyList.appendChild(listItem)
  }
})


function senioritySort() {
  populateCongressGrid(getSimplifiedCongress(senators).sort(
     (a, b) => a.seniority - b.seniority
 ).reverse())
}

function birthdaySort() {
 populateCongressGrid(getSimplifiedCongress(senators).sort(
     (a, b) => a.date_of_birth - b.date_of_birth
 ))
}


document.getElementById("Rep").addEventListener("click", function() {
  removeChildren(document.getElementById("Senators"))
  populateSenatorDiv(simplifiedMembers("Rep"))
})

populateCongressGrid(getSimplifiedCongress(senators))