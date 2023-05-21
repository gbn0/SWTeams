import express, { Request, Response } from 'express';
import { PrismaClient, Starship, Person, Team } from '@prisma/client';

const app = express()
const port = 8000
const prisma = new PrismaClient();

app.use(express.json());

app.get('/characters', (req,res,next) => {
    prisma.person.findMany()
    .then(people => res.send(people))
})

app.get('/starships', (req,res,next) => {
    prisma.starship.findMany()
    .then(starships => res.send(starships))
})

app.get('/team', (req,res,next) => {
   const team = prisma.team.findMany();
   
})

app.post('/team', async (req: Request, res: Response) => {
    try {
      // Extrair os dados da requisição
      const { char1, char2, char3, starship } = req.body;
  
      // Verificar se os personagens e a nave espacial estão disponíveis
      const [person1, person2, person3, starshipObj] = await Promise.all([
        findAvailablePerson(char1),
        findAvailablePerson(char2),
        findAvailablePerson(char3),
        prisma.starship.findFirst({ where: { id: starship, isUsed: false } }),
      ]);
  
      // Se algum dos personagens ou a nave espacial não estiverem disponíveis, retornar um erro
      if (!person1 || !person2 || !person3 || !starshipObj) {
        return res.status(400).json({ error: 'Personagens ou nave espacial não disponíveis' });
      }
  
      // Criar o novo time no banco de dados
      const team: Team = await prisma.team.create({
        data: {
            char1: char1,
            char2: char2,
            char3: char3,
            starship: starship,
          },
      });
  
      // Atualizar o status dos personagens e da nave espacial para "usado"
      await Promise.all([
        updateAllStatus([char1,char2,char3],starship, true),
      ]);
  
      // Retornar o time criado
      res.status(201).json(team);
    } catch (error) {
      console.error('Erro ao criar time:', error);
      res.status(500).json({ error: 'Erro ao criar time' });
    }
  });
  
  // Função auxiliar para encontrar uma pessoa disponível
  async function findAvailablePerson(personId: number): Promise<Person | null> {
    const person = await prisma.person.findFirst({ where: { id: personId } });
    if (person && !person.isUsed) {
      return person;
    }
    return null;
  }
  
  async function updatePersonStatus(personId: number,  isUsed: boolean) {
    await prisma.person.update({ where: { id: personId }, data: { isUsed: isUsed }});
  }

  async function updateAllStatus(personIds: number[], starshipId: number, isUsed: boolean) {
    for (const personId of personIds) {
      try {
        await updatePersonStatus(personId, isUsed);
        console.log(`Status atualizado para a pessoa com o ID ${personId}`);
      } catch (error) {
        console.error(`Erro ao atualizar o status da pessoa com o ID ${personId}`);
      }
    }
    if(starshipId == null){
      return;
    }
    await updateShipStatus(starshipId, isUsed);
    console.log(`Status atualizado para a nave com o ID ${starshipId}`)
  }

  async function updateShipStatus(shipId: number, isUsed: boolean) {
    await prisma.starship.update({ where: { id: shipId }, data: { isUsed: isUsed }});
  }

  async function updatePUT(teamID: number, fields: any) {
    const hasShip = "starship" in fields;
    const team = await prisma.team.findMany({where: { id: teamID}})
    let newIDs:number[] = []
    for(const field in fields){
    if(field == "char1") {
      await updatePersonStatus(team[0].char1, false)
      await prisma.team.update({
        where: {
          id: teamID,
        },
        data: {
          char1: fields[field],
        }
      })
      if(!hasShip){
        fields.starship = null;
      }
      newIDs.push(fields.char1);
    }else if(field == "char2") {
      await updatePersonStatus(team[0].char2, false)
      await prisma.team.update({
        where: {
          id: teamID,
        },
        data: {
          char2: fields[field],
        }
      })
      if(!hasShip){
        fields.starship = null;
      }
      newIDs.push(fields.char2);
    }else if(field == "char3") {
      await updatePersonStatus(team[0].char3, false)
      await prisma.team.update({
        where: {
          id: teamID,
        },
        data: {
          char3: fields[field],
        }
      })
      if(!hasShip){
        fields.starship = null;
      }
      newIDs.push(fields.char3);
    }else if(field == "starship") {
      await updateShipStatus(team[0].starship, false)
      await prisma.team.update({
        where: {
          id: teamID,
        },
        data: {
          starship: fields[field],
        }
      })
    }
  }
  await updateAllStatus(newIDs, fields.starship, true);

  }

app.put('/team/', (req,res,next) => {
    let tID = req.body.teamID;
    let fields = req.body.fields;
    updatePUT(tID,fields)
    .then(() => {
      res.send(`O time de ID ${tID} foi updatado nos campos ${Object.keys(fields)}`)
    })
    
})

app.delete('/team', async (req: Request, res: Response) => {
    try {
      // Extrair os dados da requisição
      const teamId = req.body.teamId;
      const teamD = await prisma.team.findMany({where: { id: teamId}})
      const char1 = teamD[0].char1
      const char2 = teamD[0].char2
      const char3 = teamD[0].char3
      const starship = teamD[0].starship
  
      const team: Team = await prisma.team.delete({
        where: {
          id: teamId,
        }
      });
  
      await Promise.all([
        updateAllStatus([char1,char2,char3],starship, false),
      ]);
  
      res.status(201).json(team);
    } catch (error) {
      console.error('Erro ao deletar time:', error);
      res.status(500).json({ error: 'Erro ao deletar time' });
    }
  });
    

app.listen(port, () => {
    console.log(`listening on ${port}`)
})


module.exports = app;