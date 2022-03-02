import { useEffect, useState } from 'react'
import { Noun as NounComponent, SeedData } from '../Noun'
import { JsonRpcProvider, Provider } from '@ethersproject/providers'
import { BigNumber, Contract } from 'ethers'
import { Col, Container, ListGroup, Row } from 'react-bootstrap'
import nounsContract from '../../abis/nounsContract.json'
import { Buffer } from 'buffer'
// extract to config
const provider: Provider = new JsonRpcProvider(
  'https://eth-mainnet.alchemyapi.io/v2/kmnvB9AUO4Ll6BQX_eg8OKCInSUZ7sT7',
)

const nounsTokenContract: Contract = new Contract(
  '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
  nounsContract,
  provider,
)

export interface Noun {
  decodedURI: any
  seedData: SeedData
  id: number
}

export const NounList = () => {
  const [totalSupply, setTotalSupply] = useState<number>()
  const [nouns, setNouns] = useState<Noun[]>()
  const [nounTraitRarity, setRarityMap] = useState<Map<number, any>>()

  const getSupply = async () => {
    const supply: BigNumber = await nounsTokenContract.totalSupply()
    setTotalSupply(supply.toNumber())
  }

  const loadNoun = async (id: number) => {
    const tokenURI: string = await nounsTokenContract.dataURI(id)
    // decode this uri and get the image field from the json
    const decodedURI = JSON.parse(
      Buffer.from(tokenURI.split('base64,')[1], 'base64').toString(),
    )
    const seedData: SeedData = (await nounsTokenContract.seeds(id)) as SeedData
    return { decodedURI, seedData, id } as Noun
  }
  const loadAllNouns = async () => {
    const nouns: Noun[] = await Promise.all(
      Array.from(Array(totalSupply)).map(async (_, i) => {
        return loadNoun(totalSupply! - i -1)
      }),
    )
    let mapTraitRarities = new Map<number, any>()
    nouns.map((noun) => {
      // for each trait, get its rarity
      let mapTrait = new Map<string, any>()
      Object.entries(noun.seedData).map((entry) => {
        const numWithSameTrait = nouns.filter((n2) => {
          const sd = n2.seedData as any
          return sd[entry[0]] === entry[1]
        }).length
        mapTrait.set(entry[0], numWithSameTrait)
      })
      mapTraitRarities.set(noun.id, mapTrait)
    })
    setRarityMap(mapTraitRarities)
    setNouns(nouns)
  }
  useEffect(() => {
    getSupply()
    if (totalSupply) {
      if (!nouns) {
        loadAllNouns()
      }
    }
  }, [totalSupply])
  return (
    <div>
      {totalSupply && nouns && nounTraitRarity ? (
        <Container>
          <Row lg={8} xl={10} md={5} sm={2} xs={1}>
            {nouns.map((noun, i) => {
              return (
                <NounComponent
                  noun={noun}
                  nounTraitRarity={nounTraitRarity}
                  key={i}
                />
              )
            })}
          </Row>
        </Container>
      ) : (
        'loading...'
      )}
    </div>
  )
}
