/* eslint-disable react-hooks/immutability -- Three.js scene objects are mutable inside useFrame. */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, RoundedBox, Sparkles } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const phaseValues = { idle: 0, forming: .2, perceiving: .44, riskDetected: .7, focused: .9, complete: 1 }
const routes = [
  [[-4.8,-2.5],[-3.2,-2.5],[-2.4,-1.2],[-.8,-.9],[.1,0],[2.1,.1],[4.5,1.8]],
  [[-4.6,1.9],[-3.1,1.5],[-2.3,.7],[-.4,.45],[1.4,.5],[2.4,-.8],[4.5,-1.8]],
  [[4.7,-.8],[3.2,-.7],[2.05,-.15],[.8,-.15],[-.3,-.1],[-1.7,-.8],[-3.7,-2.5]],
  [[4.6,2.3],[3.5,2.1],[2.15,1.15],[.7,.7],[-.8,.55],[-2.4,1.4],[-4.6,1.8]],
  [[-1.8,-3.25],[-1.7,-2],[-1.1,-1],[0,0],[.6,1.1],[.8,2.5],[.9,3.2]],
]
const walls = [
  [-3.8,-2.75,2.3,.18],[-.8,-2.75,2.1,.18],[2.25,-2.75,2.5,.18],[-3.85,2.75,2.3,.18],[-.6,2.75,2.3,.18],[2.6,2.75,1.8,.18],
  [-4.9,0,.18,5.65],[4.9,.2,.18,5.25],[-2.25,-1.65,1.45,.18],[-2.95,-.65,.18,2.15],[-2.2,1.05,1.5,.18],
  [2.25,-1.6,1.5,.18],[2.95,-.55,.18,2.2],[2.2,1.05,1.5,.18],[-.7,-1.45,1.15,.18],[.7,1.45,1.15,.18],[-.05,0,.18,1.25],
]
const cameras = [
  {x:-4.45,z:-2.35,tx:-1.8,tz:-.7,label:'CAM 01'}, {x:4.45,z:-2.35,tx:1.8,tz:-.5,label:'CAM 02'},
  {x:-4.45,z:2.35,tx:-1.5,tz:.7,label:'CAM 03'}, {x:4.45,z:2.35,tx:1.6,tz:.7,label:'CAM 04'},
]

const headGeometry = new THREE.SphereGeometry(.065,10,8)
const bodyGeometry = new THREE.CapsuleGeometry(.07,.17,4,8)
const limbGeometry = new THREE.CapsuleGeometry(.024,.15,3,6)
const cyanMaterial = new THREE.MeshStandardMaterial({color:'#67edf2',emissive:'#16c9d4',emissiveIntensity:1.5,roughness:.38})
const redMaterial = new THREE.MeshStandardMaterial({color:'#ff5969',emissive:'#ff243d',emissiveIntensity:1.8,roughness:.35})

function Person({curve,offset,speed,risk,scale=1}) {
  const person=useRef(), leftLeg=useRef(), rightLeg=useRef()
  useFrame((state)=>{const t=(state.clock.elapsedTime*speed+offset)%1; const point=curve.getPointAt(t), next=curve.getPointAt((t+.008)%1); person.current.position.set(point.x,.26+Math.abs(Math.sin((t+offset)*45))*.018,point.z); person.current.rotation.y=Math.atan2(next.x-point.x,next.z-point.z); const stride=Math.sin((state.clock.elapsedTime*speed+offset)*42)*.42; leftLeg.current.rotation.x=stride; rightLeg.current.rotation.x=-stride})
  const material=risk?redMaterial:cyanMaterial
  return <group ref={person} scale={scale}><mesh geometry={headGeometry} material={material} position={[0,.35,0]}/><mesh geometry={bodyGeometry} material={material} position={[0,.19,0]}/><mesh ref={leftLeg} geometry={limbGeometry} material={material} position={[-.035,-.01,0]}/><mesh ref={rightLeg} geometry={limbGeometry} material={material} position={[.035,-.01,0]}/></group>
}

function Crowd({phase}) {
  const riskActive=phaseValues[phase]>=.7
  const people=useMemo(()=>routes.flatMap((points,routeIndex)=>{const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,0,z)),false,'catmullrom',.25); const count=routeIndex===2?12:9; return Array.from({length:count},(_,index)=>({curve,routeIndex,index,offset:index/count+routeIndex*.037,speed:.017+(index%4)*.0016,scale:.88+(index%3)*.07}))}),[])
  return <group>{people.map((person)=><Person key={`${person.routeIndex}-${person.index}`} {...person} risk={riskActive&&person.routeIndex===2&&person.index>4}/>)}</group>
}

function VenueLabel({position,tone='cyan'}) {
  const color=tone==='danger'?'#ff4359':tone==='amber'?'#ffad44':'#25d9ea'
  return <group position={position}><mesh><boxGeometry args={[.52,.025,.16]}/><meshBasicMaterial color={color} transparent opacity={.7}/></mesh><mesh position={[-.2,.025,0]}><sphereGeometry args={[.025,8,8]}/><meshBasicMaterial color={color}/></mesh></group>
}

function Coverage({camera,active}) {
  const geometry=useMemo(()=>{const start=new THREE.Vector3(camera.x,.025,camera.z),target=new THREE.Vector3(camera.tx,.025,camera.tz),direction=target.clone().sub(start),perp=new THREE.Vector3(-direction.z,0,direction.x).normalize().multiplyScalar(direction.length()*.42),left=target.clone().add(perp),right=target.clone().sub(perp),geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute([...start.toArray(),...left.toArray(),...right.toArray()],3)); geo.computeVertexNormals(); return geo},[camera])
  return <mesh geometry={geometry}><meshBasicMaterial color="#22dce8" transparent opacity={active?.12:.035} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
}

function CameraUnit({camera,active}) {
  const angle=Math.atan2(camera.tx-camera.x,camera.tz-camera.z)
  return <group><Coverage camera={camera} active={active}/><group position={[camera.x,.42,camera.z]} rotation={[0,angle,0]}><mesh position={[0,-.16,0]}><cylinderGeometry args={[.055,.075,.3,8]}/><meshStandardMaterial color="#273e50" metalness={.6} roughness={.4}/></mesh><RoundedBox args={[.35,.18,.2]} radius={.04} position={[0,.05,.06]}><meshStandardMaterial color="#344e60" metalness={.7} roughness={.3}/></RoundedBox><mesh position={[0,.05,.18]}><circleGeometry args={[.055,16]}/><meshBasicMaterial color={active?'#78f8ff':'#1b6170'}/></mesh><VenueLabel position={[0,.34,0]}>{camera.label}</VenueLabel></group></group>
}

function Architecture({phase}) {
  const active=phaseValues[phase]>=.2, risk=phaseValues[phase]>=.7
  return <group><RoundedBox args={[10.4,.35,6.5]} radius={.1} position={[0,-.32,0]}><meshStandardMaterial color="#102131" metalness={.45} roughness={.64}/></RoundedBox><mesh position={[0,-.135,0]}><boxGeometry args={[9.9,.06,6.05]}/><meshStandardMaterial color="#132b3b" roughness={.75}/></mesh><gridHelper args={[10,20,'#1c5363','#153242']} position={[0,-.095,0]}/>
    {walls.map(([x,z,width,depth],index)=><RoundedBox key={index} args={[width,.72,depth]} radius={.035} position={[x,.25,z]}><meshStandardMaterial color="#1b3042" metalness={.25} roughness={.72}/></RoundedBox>)}
    <mesh position={[.8,-.085,-.2]} rotation={[-Math.PI/2,0,-.18]}><planeGeometry args={[3.35,1.25]}/><meshBasicMaterial color={risk?'#ff344d':'#19d8e5'} transparent opacity={risk?.18:.045} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    {risk&&<><Line points={[[ -1.4,.04,-.65],[-.45,.04,-.25],[.7,.04,-.2],[2,.04,-.15],[3.1,.04,-.65]]} color="#ff465b" lineWidth={2} transparent opacity={.7}/><VenueLabel position={[.8,.15,-.2]} tone="danger">COUNTER-FLOW</VenueLabel></>}
    {routes.map((route,index)=><Line key={index} points={route.map(([x,z])=>[x,.015,z])} color={risk&&index===2?'#ff4058':'#25d9ea'} lineWidth={index===2?1.5:.65} transparent opacity={active?.32:.06}/>)}
    {cameras.map((camera)=><CameraUnit key={camera.label} camera={camera} active={active}/>)}
    <VenueLabel position={[-4.4,.1,-3.22]}>MAIN ENTRY</VenueLabel><VenueLabel position={[4.45,.1,2.92]}>NORTH EXIT</VenueLabel><VenueLabel position={[2.8,.12,-1.35]} tone="amber">BOTTLENECK</VenueLabel>
  </group>
}

function CameraMotion() {
  const { camera, pointer } = useThree()
  const base = useMemo(() => new THREE.Vector3(8.2, 7.5, 9.5), [])
  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, base.x + pointer.x * .38, 2, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, base.y + pointer.y * .2, 2, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, base.z - pointer.x * .25, 2, delta)
    camera.lookAt(0, 0, 0)
  })
  return null
}
function Scene({phase}){return <><color attach="background" args={['#050d17']}/><fog attach="fog" args={['#050d17',12,22]}/><ambientLight intensity={.55}/><directionalLight position={[3,8,4]} intensity={1.5} color="#9ad8e8"/><pointLight position={[0,3,0]} intensity={10} distance={11} color={phaseValues[phase]>=.7?'#ff344d':'#22d9e6'}/><CameraMotion/><group rotation={[0,-.08,0]}><Architecture phase={phase}/><Crowd phase={phase}/></group><Sparkles count={45} scale={[13,4,9]} size={1} speed={.1} opacity={.14} color="#5deaf0"/></>}
export default function VenueScene({phase}){return <Canvas orthographic dpr={[1,1.6]} camera={{position:[8.2,7.5,9.5],zoom:68,near:.1,far:60}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}}><Scene phase={phase}/></Canvas>}
