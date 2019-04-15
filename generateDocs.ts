import * as fs from 'fs-extra';
import * as path from 'path';
import * as typedoc from 'typedoc';

const faceapiDir = path.resolve('./node_modules/face-api.js/src')
const tfjsImageRecognitionBaseDir = path.resolve('./node_modules/tfjs-image-recognition-base/src')

type Exlcude = {
  dir: string
  exceptions?: string[]
  excludes?: string[]
}

const faceapiExcludes: Exlcude[] = [
  { dir: 'faceLandmarkNet', exceptions: ['index.ts', 'FaceLandmark68Net.ts', 'FaceLandmark68TinyNet.ts'] },
  { dir: 'faceRecognitionNet', exceptions: ['index.ts', 'FaceRecognitionNet.ts'] },
  { dir: 'mtcnn', exceptions: ['index.ts', 'Mtcnn.ts', 'MtcnnOptions.ts'] },
  { dir: 'ssdMobilenetv1', exceptions: ['index.ts', 'SsdMobilenetv1.ts', 'SsdMobilenetv1Options.ts'] },
  { dir: 'tinyFaceDetector', exceptions: ['index.ts', 'TinyFaceDetector.ts', 'TinyFaceDetectorOptions.ts'] },
  { dir: 'tinyYolov2', exceptions: ['index.ts', 'TinyYolov2.ts'] },
  { dir: 'globalApi', excludes: ['allFaces.ts'] }
]

const tfjsImageRecognitionBaseExcludes: Exlcude[] = [
  { dir: 'common', exceptions: [] },
  { dir: 'metrics', exceptions: [] },
  { dir: 'utils', exceptions: [] },
  { dir: 'tinyYolov2', exceptions: ['TinyYolov2.ts', 'TinyYolov2Options.ts'] },
  { dir: '', excludes: ['weightsLoaderFactory.ts'] }
]

const withBaseDir = (baseDir: string) => (obj: any) => ({ ...obj, baseDir})

let exclude = faceapiExcludes.map(withBaseDir(faceapiDir))
  .concat(tfjsImageRecognitionBaseExcludes.map(withBaseDir(tfjsImageRecognitionBaseDir)))
  .map(({ baseDir, dir, exceptions, excludes }) => {
    const moduleDir = path.resolve(baseDir, dir)

    const files = fs.readdirSync(moduleDir)
      .filter(file => !excludes || (excludes as string[]).some(ex => ex === file))
      .filter(file => !((exceptions || []) as string[]).some(ex => ex === file))

    return files.map(file => `${moduleDir}/${file}`)
  }).reduce((flat, arr) => flat.concat(arr), [])

const app = new typedoc.Application({
  mode: 'file',
  theme: 'default',
  tsconfig: './tsconfig.docs.json',
  excludeExternals: true,
  includeDeclarations: true,
  excludePrivate: true,
  excludeNotExported: true,
  stripInternal: true,
  externalPattern: 'node_modules',
  exclude
})

const project = app.convert(app.expandInputFiles([
  faceapiDir,
  tfjsImageRecognitionBaseDir
]))
app.generateDocs(project, 'generated/docs')