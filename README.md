# NextJS Docker Template

Use this to get started with NextJS and docker right away
[Demo](https://next-docker.up.railway.app/)

## Building

- Run `make start` to make a production build

## Running Locally

- Install Node v16.x and PNPM (`npm install -g pnpm`)
- Install your deps `pnpm install`
- Start a dev server like so: `pnpm run dev`

## Seeding the Database
Install Prisma CLI with `pnpm add -g prisma` or use `npx` to run it locally.
- Start the database with `docker-compose up db -d`
- Run `[npx] prisma db seed` to seed the database

## Extracting Images with Bash
Pipe the data from public/data/pokedex-kalos-scrape.json into a file called pokemon-us-image-list.txt with `jq`:
```bash
cat public/data/pokedex-kalos-scrape.json | jq -r '.[].image' > pokemon-us-image-list.txt
```

Then, download the images with `wget`:
```bash
cat pokemon-us-image-list.txt | xargs -n 1 -P 8 wget -P pokemon-images
```

## Japanese Pokedex API (Codenamed: Zukan)

### Pokemon Object

| Property     | Example   | Description                                                                                                                                                         |
| ------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no`         | 0001      | The National Pokedex number of the Pokémon, which in this case corresponds to Bulbasaur.                                                                            |
| `sub`        | 0         | A sub-category indicator. In this case, it is set to 0, indicating that there is no sub-category for Bulbasaur.                                                     |
| `name`       | Bulbasaur | The English name of the Pokémon.                                                                                                                                    |
| `sub_name`   |           | The sub-name or alternative name of the Pokémon, if applicable. In this case, it is empty.                                                                          |
| `omoasa`     | 6.9       | The weight of the Pokémon in kilograms.                                                                                                                             |
| `takasa`     | 0.7       | The height of the Pokémon in meters.                                                                                                                                |
| `type_1`     | 4         | The primary type of the Pokémon. The numerical value corresponds to a specific type (e.g., 4 represents the Grass type).                                            |
| `type_2`     | 8         | The secondary type of the Pokémon, if applicable. The numerical value corresponds to a specific type (e.g., 8 represents the Poison type).                          |
| `kyodai_flg` | 0         | A flag indicating whether the Pokémon has a "Kyodai" (evolved form or alternate form). In this case, it is set to 0, indicating Bulbasaur does not have a "Kyodai." |
| `image_m`    | IMG_URL   | The URL of the medium-sized image of Bulbasaur.                                                                                                                     |
| `image_s`    | IMG_URL   | The URL of the small-sized image of Bulbasaur.                                                                                                                      |
| `zukan_no`   | 0001      | The Pokedex number used within the specific Pokemon API. In this case, it is the same as the "no" field, which represents Bulbasaur's National Pokedex number.      |

## Credits

- [Japanese Pokemon API](https://zukan.pokemon.co.jp/zukan-api/api)
- [English Pokemon API](https://pokeapi.co/docs/v2)
- [NextJS](https://nextjs.org/)
- [Docker](https://www.docker.com/)
