import { Card, Col, ListGroup } from 'react-bootstrap'
import imageData from '../../traits/image-data.json'
import { Noun as NounInterface } from '../NounList'
const { bodies, accessories, heads, glasses } = imageData.images

interface NounProps {
  noun: NounInterface
  nounTraitRarity: Map<number, any>
}
export interface SeedData {
  background: number
  body: number
  accessory: number
  head: number
  glasses: number
}
interface SeedDataRich {
  background: Trait
  body: Trait
  accessory: Trait
  head: Trait
  glasses: Trait
}

interface Trait {
  name: string
  rarity: number
}
interface TraitProps {
  traits: SeedDataRich
}
export const Noun = (props: NounProps) => {
  const Traits = (props: TraitProps) => {
    return (
      <ListGroup>
        {Object.entries(props.traits).map((entry, i) => {
          return (
            <ListGroup.Item
              key={i}
              style={{
                padding: '4px',
                backgroundColor: entry[1].rarity <= 1 ? 'pink' : 'none',
              }}
            >
              <b>{entry[0]}: </b>
              {entry[1].name}
              <br />
              <i>Rarity:</i> {entry[1].rarity}
            </ListGroup.Item>
          )
        })}
      </ListGroup>
    )
  }
  const getTraitsFromSeed = (seed: SeedData, rarityMap: Map<string, any>) => {
    return {
      body: { name: bodies[seed.body].filename, rarity: rarityMap.get('body') },
      accessory: {
        name: accessories[seed.accessory].filename,
        rarity: rarityMap.get('accessory'),
      },
      head: { name: heads[seed.head].filename, rarity: rarityMap.get('head') },
      glasses: {
        name: glasses[seed.glasses].filename,
        rarity: rarityMap.get('glasses'),
      },
      background: {
        name: imageData.bgcolors[seed.background],
        rarity: rarityMap.get('background'),
      },
    } as SeedDataRich
  }

  return (
    <>
      {props.noun ? (
        <Col style={{ margin: '10px' }}>
          <Card>
            <Card.Img
              variant="top"
              alt="alt"
              src={props.noun.decodedURI.image}
            />
            <Card.Header>
              <Card.Title>
                <b>{props.noun.id}</b>
              </Card.Title>
            </Card.Header>
            <Traits
              traits={getTraitsFromSeed(
                props.noun.seedData,
                props.nounTraitRarity.get(props.noun.id),
              )}
            />
          </Card>
        </Col>
      ) : (
        ''
      )}
    </>
  )
}
