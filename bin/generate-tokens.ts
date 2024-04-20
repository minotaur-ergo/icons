import axios from 'axios';
import { writeFileSync, readdirSync } from 'fs';
const exec = async () => {
  // reading all tokens
  const tokenDir = 'svgs/';
  const files = readdirSync(tokenDir);
  // for(const iconFile of files) {
  const res = (
    await Promise.all(
      files.map(async (iconFile) => {
        try {
          // const iconContent = readFileSync(tokenDir + iconFile).toString("utf-8");
          const tokenId = iconFile.split('.')[0];
          const detail = (
            await axios.get(
              `https://api.ergoplatform.com/api/v1/tokens/${tokenId}`,
            )
          ).data;
          const box = (
            await axios.get(
              `https://api.ergoplatform.com/api/v1/boxes/${detail.boxId}`,
            )
          ).data;
          const componentName = `Icon${tokenId}`;
          // const componentCode = transform.sync(iconContent, {
          //     icon: true,
          //     dimensions: false,
          //     exportType: 'default',
          //     svgo: true,
          //     typescript: true,
          //     svgoConfig: {
          //         "plugins": [
          //           {
          //             "name": "preset-default",
          //             "params": {
          //               "overrides": {
          //                 "removeTitle": false
          //               }
          //             }
          //           }
          //         ]
          //       },
          //       jsxRuntime: 'automatic',
          //       prettier: true,
          //       prettierConfig: {
          //         semi: false
          //       }
          // },{
          //     componentName
          // })
          // console.log()
          // const component2 = (await axios.post('https://api.react-svgr.com/api/svgr', {
          //     "code": iconContent.trim(),
          //     "options": {
          //       "dimensions": true,
          //       "icon": false,
          //       "native": false,
          //       "typescript": false,
          //       "ref": false,
          //       "memo": false,
          //       "titleProp": false,
          //       "descProp": false,
          //       "expandProps": "end",
          //       "replaceAttrValues": {

          //       },
          //       "svgProps": {

          //       },
          //       "exportType": "default",
          //       "namedExport": "ReactComponent",
          //       "jsxRuntime": "classic",
          //       "svgo": true,
          //       "svgoConfig": {
          //         "plugins": [
          //           {
          //             "name": "preset-default",
          //             "params": {
          //               "overrides": {
          //                 "removeTitle": false
          //               }
          //             }
          //           }
          //         ]
          //       },
          //       "prettier": true,
          //       "prettierConfig": {
          //         "semi": false
          //       }
          //     }
          //   }
          // )).data
          // const componentCode = component.replace("{...props}", "").replace("(props)", "()").replaceAll("SvgComponent", componentName)
          // writeFileSync(`src/icons/${componentName}.tsx`, componentCode);
          const jsonName = `token-${tokenId}`;
          const jsonFileContent = `import ${componentName} from './icons/${componentName}';
import { Token } from './types';
            
const ${jsonName.replaceAll('-', '_')}: Token = {
    id: '${tokenId}',
    boxId: '${detail.boxId}',
    decimals: ${detail.decimals},
    description: \`${detail.description}\`,
    emissionAmount: ${detail.emissionAmount.toString()}n,
    height: ${box.settlementHeight},
    icon: ${componentName},
    name: \`${detail.name}\`,
    networkType: 'mainnet',
    txId: '${box.transactionId}',
};

export default ${jsonName.replaceAll('-', '_')};
`;
          writeFileSync(`src/${jsonName}.ts`, jsonFileContent);
          return tokenId;
        } catch (e) {
          console.log(iconFile, e);
        }
        return '';
      }),
    )
  ).filter((item) => item !== '');
  const imports = res.map(
    (item) => `import Token${item} from './token-${item}'`,
  );
  const maps = res.map((item) => `\t'${item}': Token${item}`);
  const indexCode = `import { Token } from './types';
${imports.join('\n')}

const tokenRecords = {
${maps.join(',\n')}
}

const tokens: Map<string, Token> = new Map(Object.entries(tokenRecords));

export default tokens;
`;
  writeFileSync('src/index.ts', indexCode);
};

await exec();
