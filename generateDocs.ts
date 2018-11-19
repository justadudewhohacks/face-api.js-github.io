import * as fs from 'fs-extra';
import * as path from 'path';
import * as typedoc from 'typedoc';

const baseDir = './node_modules/face-api.js'

const excludes = [
  { dir: 'faceLandmarkNet', exceptions: ['index.ts', 'FaceLandmark68Net.ts', 'FaceLandmark68TinyNet.ts'] },
  { dir: 'faceRecognitionNet', exceptions: ['index.ts', 'FaceRecognitionNet.ts'] },
  { dir: 'mtcnn', exceptions: ['index.ts', 'Mtcnn.ts', 'MtcnnOptions.ts'] },
  { dir: 'ssdMobilenetv1', exceptions: ['index.ts', 'SsdMobilenetv1.ts', 'SsdMobilenetv1Options.ts'] },
  { dir: 'tinyFaceDetector', exceptions: ['index.ts', 'TinyFaceDetector.ts', 'TinyFaceDetectorOptions.ts'] },
  { dir: 'tinyYolov2', exceptions: ['index.ts', 'TinyYolov2.ts'] }
]

const exclude = excludes.map(({ dir, exceptions }) => {
  const files = fs.readdirSync(path.resolve(baseDir, 'src'))
    .filter(file => !exceptions.some(ex => ex === file))

  return files.map(file => `**/${dir}/${file}`)
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
  path.join(baseDir, 'src'),
  //'./node_modules/tfjs-image-recognition-base/src'
]))
app.generateDocs(project, 'generated/docs')