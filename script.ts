import { PrismaClient } from '@prisma/client'
import axios from 'axios'

export const prisma = new PrismaClient();


// axios.get('http://localhost:8000')
// .then(res => {
//   console.log(res)
// })

async function main() {

  // prisma.starship.update({
  //   where: {
  //     id:2,
  //   },
  //   data: {
  //     isUsed: false,
  //   }
  // }).then(ship => {
  //   console.log(ship);
  // })


    // for(var i = 74; i <= 75; i++) {
    //   let a: number = i;
    //     axios.get(`https://swapi.dev/api/starships/${i}`)
    //     .then(res => {
    //             prisma.starship.create({
    //                 data: {
    //                     id: a,
    //                     name: res.data.name,
    //                     model: res.data.model,
    //                     manufacturer: res.data.manufacturer,
    //                     cost: res.data.cost_in_credits,
    //                     length: res.data.length,
    //                     crewSize: res.data.crew,
    //                     consumables: res.data.consumables,
    //                     cargo: res.data.cargo_capacity,
    //                 }
    //             }).then((user: any) => {
    //                 console.log(user)
    //             })
    //         })
    // }

    // const users = await prisma.user.findMany()
    // console.log(users)
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })