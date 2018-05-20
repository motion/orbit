import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Header, Join } from '~/components'
import {
  Section,
  SectionContent,
  Slant,
  Title,
  P,
  P2,
  LeftSide,
  RightSide,
  AppleLogo,
} from '~/views'
import girlImg from '~/../public/video-girl.jpg'
import HomeIllustration from './HomeIllustration'
import * as Constants from '~/constants'
import Media from 'react-media'
import Router from '~/router'

const SubLink = view('a', {
  color: '#fff',
  borderBottom: [1, 'dotted', [255, 255, 255, 0.1]],
})

const Stars = () => (
  <svg width="830px" height="1603px" viewBox="-1 -1 830 1603">
    <g
      id="Group"
      opacity="0.25"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
    >
      <g
        transform="translate(414.000000, 801.000000) rotate(-270.000000) translate(-414.000000, -801.000000) translate(-387.000000, 387.000000)"
        id="Oval"
        fill-rule="nonzero"
        fill="#FFFFFF"
      >
        <circle cx="736.67" cy="428.49" r="2.03" />
        <circle cx="780.49" cy="289.85" r="2.03" />
        <circle cx="559.24" cy="199.33" r="2.03" />
        <circle cx="758.22" cy="139.71" r="2.03" />
        <circle cx="816.7" cy="441.84" r="1.02" />
        <circle cx="846.87" cy="431.79" r="1.02" />
        <circle cx="937.38" cy="469.14" r="1.02" />
        <circle cx="930.19" cy="438.97" r="1.02" />
        <circle cx="811.67" cy="364.98" r="1.02" />
        <circle cx="713.26" cy="325.47" r="1.02" />
        <circle cx="744.9" cy="378.72" r="1.02" />
        <circle cx="731.22" cy="321.87" r="1.02" />
        <circle cx="701.77" cy="293.86" r="1.02" />
        <circle cx="790.12" cy="228.49" r="1.02" />
        <circle cx="839.68" cy="260.81" r="1.02" />
        <circle cx="869.14" cy="234.23" r="1.02" />
        <circle cx="841.84" cy="186.82" r="1.02" />
        <circle cx="627.78" cy="149.47" r="1.02" />
        <circle cx="680.22" cy="132.94" r="1.02" />
        <circle cx="795.15" cy="216.27" r="1.02" />
        <circle cx="762.83" cy="248.6" r="1.02" />
        <circle cx="786.53" cy="200.47" r="1.02" />
        <circle cx="653.64" cy="337.68" r="1.02" />
        <circle cx="623.47" cy="367.85" r="1.02" />
        <circle cx="701.05" cy="465.55" r="1.02" />
        <circle cx="709.67" cy="497.16" r="1.02" />
        <circle cx="522.91" cy="356.36" r="1.02" />
        <circle cx="627.78" cy="622.15" r="1.02" />
        <circle cx="655.08" cy="613.53" r="1.02" />
        <circle cx="745.59" cy="650.89" r="1.02" />
        <circle cx="738.4" cy="620.72" r="1.02" />
        <circle cx="621.32" cy="545.29" r="1.02" />
        <circle cx="816.7" cy="607.07" r="1.02" />
        <circle cx="818.14" cy="582.64" r="1.02" />
        <circle cx="879.91" cy="658.79" r="1.02" />
        <circle cx="860.52" cy="556.06" r="1.02" />
        <circle cx="908.64" cy="565.4" r="1.02" />
        <circle cx="1055.78" cy="636.48" r="1.02" />
        <circle cx="1083.07" cy="627.86" r="1.02" />
        <circle cx="1173.58" cy="665.21" r="1.02" />
        <circle cx="1166.4" cy="635.04" r="1.02" />
        <circle cx="703.92" cy="706.92" r="1.02" />
        <circle cx="467.3" cy="410.53" r="2.03" />
        <circle cx="423.48" cy="549.18" r="2.03" />
        <circle cx="644.72" cy="639.69" r="2.03" />
        <circle cx="381.47" cy="647.37" r="2.03" />
        <circle cx="337.79" cy="762.17" r="2.03" />
        <circle cx="530.8" cy="762.17" r="2.03" />
        <circle cx="389.3" cy="395.15" r="1.02" />
        <circle cx="359.13" cy="405.21" r="1.02" />
        <circle cx="268.62" cy="367.85" r="1.02" />
        <circle cx="275.81" cy="398.02" r="1.02" />
        <circle cx="394.33" cy="472.01" r="1.02" />
        <circle cx="492.74" cy="511.52" r="1.02" />
        <circle cx="485.09" cy="493.97" r="1.02" />
        <circle cx="474.78" cy="515.12" r="1.02" />
        <circle cx="504.23" cy="543.13" r="1.02" />
        <circle cx="415.88" cy="608.5" r="1.02" />
        <circle cx="366.31" cy="576.18" r="1.02" />
        <circle cx="336.86" cy="602.76" r="1.02" />
        <circle cx="364.16" cy="650.17" r="1.02" />
        <circle cx="578.22" cy="687.53" r="1.02" />
        <circle cx="525.78" cy="704.05" r="1.02" />
        <circle cx="410.85" cy="620.72" r="1.02" />
        <circle cx="443.17" cy="588.39" r="1.02" />
        <circle cx="419.47" cy="636.52" r="1.02" />
        <circle cx="552.36" cy="499.31" r="1.02" />
        <circle cx="582.53" cy="469.14" r="1.02" />
        <circle cx="504.95" cy="371.44" r="1.02" />
        <circle cx="496.33" cy="339.83" r="1.02" />
        <circle cx="683.09" cy="480.63" r="1.02" />
        <circle cx="578.22" cy="214.84" r="1.02" />
        <circle cx="550.92" cy="223.46" r="1.02" />
        <circle cx="460.41" cy="186.1" r="1.02" />
        <circle cx="467.6" cy="216.27" r="1.02" />
        <circle cx="584.68" cy="291.7" r="1.02" />
        <circle cx="389.3" cy="229.92" r="1.02" />
        <circle cx="387.86" cy="254.35" r="1.02" />
        <circle cx="326.09" cy="178.2" r="1.02" />
        <circle cx="345.48" cy="280.93" r="1.02" />
        <circle cx="297.36" cy="271.59" r="1.02" />
        <circle cx="495.61" cy="53.2" r="1.02" />
        <circle cx="468.32" cy="61.82" r="1.02" />
        <circle cx="377.81" cy="24.47" r="1.02" />
        <circle cx="384.99" cy="54.64" r="1.02" />
        <circle cx="502.08" cy="130.07" r="1.02" />
        <circle cx="971.51" cy="306.5" r="2.03" />
        <circle cx="904.46" cy="177.47" r="2.03" />
        <circle cx="684.02" cy="269.92" r="2.03" />
        <circle cx="782.56" cy="87.06" r="2.03" />
        <circle cx="620.02" cy="56.58" r="2.03" />
        <circle cx="1038.55" cy="259.76" r="1.02" />
        <circle cx="1052.78" cy="231.32" r="1.02" />
        <circle cx="1150.47" cy="189.19" r="1.02" />
        <circle cx="1116.78" cy="177.47" r="1.02" />
        <circle cx="1255.95" cy="257.73" r="1.02" />
        <circle cx="1348.39" cy="251.64" r="1.02" />
        <circle cx="1334.17" cy="431.46" r="1.02" />
        <circle cx="980.65" cy="208.97" r="1.02" />
        <circle cx="883.13" cy="250.62" r="1.02" />
        <circle cx="938.16" cy="290.78" r="1.02" />
        <circle cx="893.29" cy="235.38" r="1.02" />
        <circle cx="852.65" cy="236.4" r="1.02" />
        <circle cx="868.91" cy="127.69" r="1.02" />
        <circle cx="926.81" cy="115.5" r="1.02" />
        <circle cx="928.84" cy="75.88" r="1.02" />
        <circle cx="876.02" cy="61.66" r="1.02" />
        <circle cx="698.24" cy="186.62" r="1.02" />
        <circle cx="723.64" cy="137.85" r="1.02" />
        <circle cx="863.83" cy="115.5" r="1.02" />
        <circle cx="863.83" cy="161.22" r="1.02" />
        <circle cx="846.56" cy="110.42" r="1.02" />
        <circle cx="849.61" cy="301.42" r="1.02" />
        <circle cx="849.61" cy="344.09" r="1.02" />
        <circle cx="973.54" cy="358.31" r="1.02" />
        <circle cx="1001.98" cy="374.56" r="1.02" />
        <circle cx="770.37" cy="407.07" r="1.02" />
        <circle cx="1032.46" cy="520.86" r="1.02" />
        <circle cx="1045.67" cy="495.46" r="1.02" />
        <circle cx="1136.08" cy="457.87" r="1.02" />
        <circle cx="1109.66" cy="441.62" r="1.02" />
        <circle cx="973.54" cy="471.08" r="1.02" />
        <circle cx="1152.5" cy="405.58" r="1.02" />
        <circle cx="1438.97" cy="416.76" r="1.02" />
        <circle cx="1236.65" cy="368.47" r="1.02" />
        <circle cx="1150.3" cy="309.54" r="1.02" />
        <circle cx="1190.93" cy="282.11" r="1.02" />
        <circle cx="1205.15" cy="576.73" r="1.02" />
        <circle cx="1311.55" cy="669.72" r="1.02" />
        <circle cx="1415.17" cy="636.2" r="1.02" />
        <circle cx="1455.8" cy="648.39" r="1.02" />
        <circle cx="1483.23" cy="635.18" r="1.02" />
        <circle cx="1375.55" cy="615.88" r="1.02" />
        <circle cx="1431.42" cy="717.47" r="1.02" />
        <circle cx="1398.91" cy="733.73" r="1.02" />
        <circle cx="1429.39" cy="740.84" r="1.02" />
        <circle cx="1171.8" cy="598.61" r="1.02" />
        <circle cx="1495.42" cy="714.42" r="1.02" />
        <circle cx="1464.94" cy="698.17" r="1.02" />
        <circle cx="1433.45" cy="753.03" r="1.02" />
        <circle cx="1483.23" cy="742.87" r="1.02" />
        <circle cx="1483.23" cy="742.87" r="1.02" />
        <circle cx="1375.55" cy="727.63" r="1.02" />
        <circle cx="1146.24" cy="526.95" r="1.02" />
        <circle cx="768.34" cy="484.28" r="2.03" />
        <circle cx="835.38" cy="613.31" r="2.03" />
        <circle cx="1055.82" cy="520.86" r="2.03" />
        <circle cx="991.83" cy="510.7" r="2.03" />
        <circle cx="957.29" cy="703.73" r="2.03" />
        <circle cx="703.32" cy="528.99" r="1.02" />
        <circle cx="689.1" cy="557.43" r="1.02" />
        <circle cx="598.69" cy="595.02" r="1.02" />
        <circle cx="624.09" cy="589.94" r="1.02" />
        <circle cx="534.69" cy="581.81" r="1.02" />
        <circle cx="625.1" cy="611.28" r="1.02" />
        <circle cx="761.23" cy="579.78" r="1.02" />
        <circle cx="858.75" cy="538.13" r="1.02" />
        <circle cx="847.57" cy="547.27" r="1.02" />
        <circle cx="848.59" cy="553.37" r="1.02" />
        <circle cx="889.22" cy="552.35" r="1.02" />
        <circle cx="872.97" cy="661.06" r="1.02" />
        <circle cx="815.07" cy="673.25" r="1.02" />
        <circle cx="813.04" cy="712.87" r="1.02" />
        <circle cx="865.86" cy="727.09" r="1.02" />
        <circle cx="1043.63" cy="602.13" r="1.02" />
        <circle cx="1018.24" cy="650.9" r="1.02" />
        <circle cx="878.05" cy="673.25" r="1.02" />
        <circle cx="878.05" cy="627.53" r="1.02" />
        <circle cx="895.32" cy="678.33" r="1.02" />
        <circle cx="892.27" cy="487.33" r="1.02" />
        <circle cx="892.27" cy="444.66" r="1.02" />
        <circle cx="768.34" cy="430.44" r="1.02" />
        <circle cx="739.89" cy="414.19" r="1.02" />
        <circle cx="971.51" cy="381.68" r="1.02" />
        <circle cx="709.42" cy="267.89" r="1.02" />
        <circle cx="696.21" cy="293.29" r="1.02" />
        <circle cx="605.8" cy="330.88" r="1.02" />
        <circle cx="632.21" cy="347.13" r="1.02" />
        <circle cx="768.34" cy="317.67" r="1.02" />
        <circle cx="586.5" cy="412.15" r="1.02" />
        <circle cx="602.75" cy="430.44" r="1.02" />
        <circle cx="505.23" cy="420.28" r="1.02" />
        <circle cx="591.58" cy="479.21" r="1.02" />
        <circle cx="426.17" cy="451.3" r="1.02" />
        <circle cx="536.72" cy="212.02" r="1.02" />
        <circle cx="523.52" cy="237.41" r="1.02" />
        <circle cx="433.11" cy="275" r="1.02" />
        <circle cx="459.52" cy="291.26" r="1.02" />
        <circle cx="1386.5" cy="394.86" r="2.03" />
        <circle cx="1435.48" cy="652.45" r="2.03" />
        <circle cx="1563.93" cy="624.02" r="2.03" />
        <circle cx="1457.83" cy="801.79" r="2.03" />
        <circle cx="1308.5" cy="379.48" r="1.02" />
        <circle cx="1278.33" cy="389.54" r="1.02" />
        <circle cx="1187.82" cy="352.18" r="1.02" />
        <circle cx="1195.01" cy="382.35" r="1.02" />
        <circle cx="1313.53" cy="456.35" r="1.02" />
        <circle cx="1505.58" cy="614.86" r="1.02" />
        <circle cx="1380.3" cy="442.61" r="1.02" />
        <circle cx="1487.29" cy="617.91" r="1.02" />
        <circle cx="1516.75" cy="646.36" r="1.02" />
        <circle cx="1428.37" cy="711.38" r="1.02" />
        <circle cx="1378.6" cy="678.87" r="1.02" />
        <circle cx="1349.14" cy="705.28" r="1.02" />
        <circle cx="1376.56" cy="753.03" r="1.02" />
        <circle cx="1497.42" cy="671.86" r="1.02" />
        <circle cx="1538.08" cy="806.87" r="1.02" />
        <circle cx="1423.29" cy="723.57" r="1.02" />
        <circle cx="1455.8" cy="691.06" r="1.02" />
        <circle cx="1432.44" cy="739.82" r="1.02" />
        <circle cx="1564.5" cy="602.67" r="1.02" />
        <circle cx="1501.73" cy="453.47" r="1.02" />
        <circle cx="1424.15" cy="355.77" r="1.02" />
        <circle cx="1415.53" cy="324.16" r="1.02" />
        <circle cx="1497.42" cy="199.17" r="1.02" />
        <circle cx="1470.12" cy="207.79" r="1.02" />
        <circle cx="1379.62" cy="170.43" r="1.02" />
        <circle cx="1386.8" cy="200.6" r="1.02" />
        <circle cx="1503.88" cy="276.03" r="1.02" />
        <circle cx="1308.5" cy="214.25" r="1.02" />
        <circle cx="1307.07" cy="238.68" r="1.02" />
        <circle cx="1245.29" cy="162.53" r="1.02" />
        <circle cx="1264.68" cy="265.26" r="1.02" />
        <circle cx="1216.56" cy="255.92" r="1.02" />
        <circle cx="1069.42" cy="184.84" r="1.02" />
        <circle cx="1042.13" cy="193.46" r="1.02" />
        <circle cx="951.62" cy="156.11" r="1.02" />
        <circle cx="958.8" cy="186.28" r="1.02" />
        <circle cx="1421.28" cy="114.4" r="1.02" />
        <circle cx="1478.45" cy="183.66" r="2.03" />
        <circle cx="1592.37" cy="61.18" r="2.03" />
        <circle cx="1546.98" cy="133.8" r="1.02" />
        <circle cx="1572.84" cy="322.01" r="1.02" />
        <circle cx="1542.67" cy="352.18" r="1.02" />
        <circle cx="1442.11" cy="340.69" r="1.02" />
        <circle cx="1546.98" cy="606.48" r="1.02" />
        <circle cx="1574.28" cy="597.86" r="1.02" />
        <circle cx="1540.52" cy="529.62" r="1.02" />
        <circle cx="1151.66" cy="516.86" r="2.03" />
        <circle cx="1311.55" cy="764.21" r="2.03" />
        <circle cx="1531.99" cy="671.76" r="2.03" />
        <circle cx="1242.91" cy="728.65" r="2.03" />
        <circle cx="1585.26" cy="728.65" r="2.03" />
        <circle cx="1086.65" cy="561.56" r="1.02" />
        <circle cx="1072.42" cy="590" r="1.02" />
        <circle cx="974.73" cy="632.13" r="1.02" />
        <circle cx="1008.43" cy="643.85" r="1.02" />
        <circle cx="869.25" cy="563.59" r="1.02" />
        <circle cx="1144.55" cy="612.35" r="1.02" />
        <circle cx="1326.79" cy="685.98" r="1.02" />
        <circle cx="1187.04" cy="530.54" r="1.02" />
        <circle cx="1324.76" cy="704.27" r="1.02" />
        <circle cx="1365.39" cy="703.25" r="1.02" />
        <circle cx="1349.14" cy="811.95" r="1.02" />
        <circle cx="1198.39" cy="705.82" r="1.02" />
        <circle cx="1196.36" cy="745.44" r="1.02" />
        <circle cx="1249.18" cy="759.66" r="1.02" />
        <circle cx="1519.8" cy="753.03" r="1.02" />
        <circle cx="1494.4" cy="801.79" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1354.22" cy="778.43" r="1.02" />
        <circle cx="1278.64" cy="710.9" r="1.02" />
        <circle cx="1368.44" cy="638.23" r="1.02" />
        <circle cx="1368.44" cy="595.56" r="1.02" />
        <circle cx="1151.66" cy="463.01" r="1.02" />
        <circle cx="1123.22" cy="446.76" r="1.02" />
        <circle cx="1354.83" cy="414.25" r="1.02" />
        <circle cx="1092.74" cy="300.46" r="1.02" />
        <circle cx="1079.54" cy="325.86" r="1.02" />
        <circle cx="989.12" cy="363.45" r="1.02" />
        <circle cx="1015.54" cy="379.71" r="1.02" />
        <circle cx="1151.66" cy="350.24" r="1.02" />
        <circle cx="972.7" cy="415.74" r="1.02" />
        <circle cx="888.55" cy="452.85" r="1.02" />
        <circle cx="974.9" cy="511.78" r="1.02" />
        <circle cx="934.27" cy="539.21" r="1.02" />
        <circle cx="920.05" cy="244.59" r="1.02" />
        <circle cx="906.84" cy="269.99" r="1.02" />
        <circle cx="842.84" cy="323.83" r="1.02" />
        <circle cx="953.4" cy="222.71" r="1.02" />
        <circle cx="842.84" cy="212.08" r="1.02" />
        <circle cx="978.97" cy="294.37" r="1.02" />
        <circle cx="1354.83" cy="339.07" r="2.03" />
        <circle cx="1287.78" cy="210.05" r="2.03" />
        <circle cx="1067.34" cy="302.5" r="2.03" />
        <circle cx="1131.34" cy="312.65" r="2.03" />
        <circle cx="1165.88" cy="119.63" r="2.03" />
        <circle cx="1421.88" cy="292.34" r="1.02" />
        <circle cx="1436.1" cy="263.89" r="1.02" />
        <circle cx="1526.51" cy="226.3" r="1.02" />
        <circle cx="1501.11" cy="231.38" r="1.02" />
        <circle cx="1590.51" cy="239.51" r="1.02" />
        <circle cx="1500.1" cy="210.05" r="1.02" />
        <circle cx="1363.97" cy="241.54" r="1.02" />
        <circle cx="1266.45" cy="283.19" r="1.02" />
        <circle cx="1277.63" cy="274.05" r="1.02" />
        <circle cx="1010.28" cy="135.34" r="1.02" />
        <circle cx="1235.98" cy="268.97" r="1.02" />
        <circle cx="1252.23" cy="160.26" r="1.02" />
        <circle cx="1310.13" cy="148.07" r="1.02" />
        <circle cx="1312.17" cy="108.45" r="1.02" />
        <circle cx="1259.34" cy="94.23" r="1.02" />
        <circle cx="1081.57" cy="219.19" r="1.02" />
        <circle cx="1106.96" cy="170.42" r="1.02" />
        <circle cx="1247.15" cy="148.07" r="1.02" />
        <circle cx="1247.15" cy="193.79" r="1.02" />
        <circle cx="1229.88" cy="142.99" r="1.02" />
        <circle cx="1232.93" cy="333.99" r="1.02" />
        <circle cx="1232.93" cy="376.66" r="1.02" />
        <circle cx="1356.86" cy="390.88" r="1.02" />
        <circle cx="1385.31" cy="407.14" r="1.02" />
        <circle cx="1153.69" cy="439.65" r="1.02" />
        <circle cx="1508.62" cy="671.76" r="1.02" />
        <circle cx="1359.74" cy="734.74" r="1.02" />
        <circle cx="1519.4" cy="490.44" r="1.02" />
        <circle cx="1492.99" cy="474.19" r="1.02" />
        <circle cx="1449.71" cy="621.97" r="1.02" />
        <circle cx="1538.7" cy="409.17" r="1.02" />
        <circle cx="1522.45" cy="390.88" r="1.02" />
        <circle cx="1533.62" cy="342.12" r="1.02" />
        <circle cx="1574.26" cy="314.69" r="1.02" />
        <circle cx="1588.48" cy="609.31" r="1.02" />
        <circle cx="1529.56" cy="559.53" r="1.02" />
        <circle cx="595.64" cy="261.8" r="1.02" />
        <circle cx="228.08" cy="231.86" r="2.03" />
        <circle cx="210.81" cy="235.92" r="2.03" />
        <circle cx="88.91" cy="226.78" r="2.03" />
        <circle cx="95" cy="348.69" r="2.03" />
        <circle cx="101.1" cy="625.02" r="2.03" />
        <circle cx="388.19" cy="518.49" r="1.02" />
        <circle cx="376.7" cy="486.88" r="1.02" />
        <circle cx="302.71" cy="342.49" r="1.02" />
        <circle cx="355.15" cy="325.97" r="1.02" />
        <circle cx="328.57" cy="530.71" r="1.02" />
        <circle cx="298.4" cy="560.88" r="1.02" />
        <circle cx="375.98" cy="658.58" r="1.02" />
        <circle cx="384.6" cy="690.18" r="1.02" />
        <circle cx="197.83" cy="549.38" r="1.02" />
        <circle cx="296.24" cy="738.32" r="1.02" />
        <circle cx="142.23" cy="603.56" r="2.03" />
        <circle cx="98.41" cy="742.2" r="2.03" />
        <circle cx="64.23" cy="588.18" r="1.02" />
        <circle cx="34.06" cy="598.23" r="1.02" />
        <circle cx="131.48" cy="551.73" r="1.02" />
        <circle cx="138.67" cy="581.91" r="1.02" />
        <circle cx="69.26" cy="665.04" r="1.02" />
        <circle cx="167.67" cy="704.55" r="1.02" />
        <circle cx="153.3" cy="703.11" r="1.02" />
        <circle cx="149.71" cy="708.14" r="1.02" />
        <circle cx="179.16" cy="736.16" r="1.02" />
        <circle cx="227.29" cy="692.34" r="1.02" />
        <circle cx="257.45" cy="662.17" r="1.02" />
        <circle cx="179.88" cy="564.47" r="1.02" />
        <circle cx="171.26" cy="532.86" r="1.02" />
        <circle cx="358.02" cy="673.66" r="1.02" />
        <circle cx="253.14" cy="407.86" r="1.02" />
        <circle cx="225.85" cy="416.48" r="1.02" />
        <circle cx="135.34" cy="379.13" r="1.02" />
        <circle cx="142.52" cy="409.3" r="1.02" />
        <circle cx="259.61" cy="484.73" r="1.02" />
        <circle cx="64.23" cy="422.95" r="1.02" />
        <circle cx="62.79" cy="447.37" r="1.02" />
        <circle cx="1.02" cy="371.23" r="1.02" />
        <circle cx="20.41" cy="473.95" r="1.02" />
        <circle cx="2.76" cy="444.3" r="1.02" />
        <circle cx="170.54" cy="246.23" r="1.02" />
        <circle cx="143.24" cy="254.85" r="1.02" />
        <circle cx="52.73" cy="217.5" r="1.02" />
        <circle cx="59.92" cy="247.67" r="1.02" />
        <circle cx="177" cy="323.1" r="1.02" />
        <circle cx="358.95" cy="462.95" r="2.03" />
        <circle cx="292.08" cy="57.12" r="2.03" />
        <circle cx="373.17" cy="379.64" r="1.02" />
        <circle cx="378.25" cy="722.01" r="1.02" />
        <circle cx="364.03" cy="750.46" r="1.02" />
        <circle cx="384.35" cy="460.92" r="1.02" />
        <circle cx="295.12" cy="216.62" r="1.02" />
        <circle cx="280.73" cy="523.91" r="1.02" />
        <circle cx="307.14" cy="540.16" r="1.02" />
        <circle cx="261.43" cy="605.18" r="1.02" />
        <circle cx="277.68" cy="623.47" r="1.02" />
        <circle cx="180.16" cy="613.31" r="1.02" />
        <circle cx="266.51" cy="672.23" r="1.02" />
        <circle cx="225.87" cy="699.66" r="1.02" />
        <circle cx="352.37" cy="152.96" r="2.03" />
        <circle cx="310.36" cy="251.16" r="2.03" />
        <circle cx="403.67" cy="118.9" r="1.02" />
        <circle cx="344.77" cy="212.29" r="1.02" />
        <circle cx="295.2" cy="179.96" r="1.02" />
        <circle cx="265.75" cy="206.54" r="1.02" />
        <circle cx="293.05" cy="253.96" r="1.02" />
        <circle cx="339.74" cy="224.5" r="1.02" />
        <circle cx="372.06" cy="192.18" r="1.02" />
        <circle cx="348.36" cy="240.31" r="1.02" />
        <circle cx="317.08" cy="122.28" r="1.02" />
        <circle cx="257.46" cy="134.49" r="1.02" />
        <circle cx="227.29" cy="164.66" r="1.02" />
        <circle cx="304.87" cy="262.36" r="1.02" />
        <circle cx="313.49" cy="293.97" r="1.02" />
        <circle cx="126.72" cy="153.17" r="1.02" />
        <circle cx="225.13" cy="342.1" r="1.02" />
        <circle cx="96.56" cy="308.34" r="1.02" />
        <circle cx="108.05" cy="339.95" r="1.02" />
        <circle cx="156.18" cy="296.13" r="1.02" />
        <circle cx="186.35" cy="265.95" r="1.02" />
        <circle cx="108.77" cy="168.26" r="1.02" />
        <circle cx="100.15" cy="136.65" r="1.02" />
        <circle cx="286.91" cy="277.45" r="1.02" />
        <circle cx="307.14" cy="325.8" r="1.02" />
        <circle cx="292.92" cy="354.25" r="1.02" />
        <circle cx="209.62" cy="127.69" r="1.02" />
        <circle cx="236.03" cy="143.95" r="1.02" />
        <circle cx="190.32" cy="208.97" r="1.02" />
        <circle cx="206.57" cy="227.25" r="1.02" />
        <circle cx="109.05" cy="217.09" r="1.02" />
        <circle cx="195.4" cy="276.02" r="1.02" />
        <circle cx="154.76" cy="303.45" r="1.02" />
        <circle cx="211.65" cy="405.04" r="1.02" />
        <circle cx="198.44" cy="430.44" r="1.02" />
        <circle cx="108.03" cy="468.03" r="1.02" />
        <circle cx="134.45" cy="484.28" r="1.02" />
        <circle cx="1462.91" cy="641.28" r="1.02" />
        <circle cx="1315.71" cy="469.37" r="2.03" />
        <circle cx="1331.09" cy="389.33" r="1.02" />
        <circle cx="1321.03" cy="359.16" r="1.02" />
        <circle cx="1358.39" cy="268.64" r="1.02" />
        <circle cx="1328.22" cy="275.83" r="1.02" />
        <circle cx="1254.23" cy="394.36" r="1.02" />
        <circle cx="1214.72" cy="492.78" r="1.02" />
        <circle cx="1325.77" cy="603.69" r="1.02" />
        <circle cx="1211.13" cy="474.82" r="1.02" />
        <circle cx="1202.28" cy="528.51" r="1.02" />
        <circle cx="1350.15" cy="701.22" r="1.02" />
        <circle cx="1447.67" cy="624.01" r="1.02" />
        <circle cx="1388.18" cy="472.63" r="1.02" />
        <circle cx="1511.39" cy="578.26" r="1.02" />
        <circle cx="1502.77" cy="550.96" r="1.02" />
        <circle cx="1509.95" cy="467.63" r="1.02" />
        <circle cx="1496.3" cy="389.33" r="1.02" />
        <circle cx="1471.88" cy="387.89" r="1.02" />
        <circle cx="1445.3" cy="345.51" r="1.02" />
        <circle cx="1454.64" cy="297.38" r="1.02" />
        <circle cx="1398.91" cy="624.01" r="1.02" />
        <circle cx="1312.57" cy="669.72" r="1.02" />
        <circle cx="1514.21" cy="536.76" r="1.02" />
        <circle cx="1501.96" cy="498.17" r="1.02" />
        <circle cx="1451.23" cy="433.14" r="1.02" />
        <circle cx="1434.97" cy="459.55" r="1.02" />
        <circle cx="1165.38" cy="61.18" r="2.03" />
        <circle cx="1564.94" cy="156.68" r="2.03" />
        <circle cx="1499.45" cy="90.94" r="2.03" />
        <circle cx="1377.55" cy="97.04" r="2.03" />
        <circle cx="1207.76" cy="388.22" r="1.02" />
        <circle cx="1239.36" cy="376.72" r="1.02" />
        <circle cx="1383.74" cy="302.73" r="1.02" />
        <circle cx="1400.26" cy="355.17" r="1.02" />
        <circle cx="1195.54" cy="328.59" r="1.02" />
        <circle cx="1193.39" cy="171.27" r="1.02" />
        <circle cx="1318.38" cy="253.16" r="1.02" />
        <circle cx="1309.76" cy="225.87" r="1.02" />
        <circle cx="1347.11" cy="135.35" r="1.02" />
        <circle cx="1316.94" cy="142.54" r="1.02" />
        <circle cx="1241.52" cy="259.63" r="1.02" />
        <circle cx="1303.29" cy="64.23" r="1.02" />
        <circle cx="1278.87" cy="62.8" r="1.02" />
        <circle cx="1355.01" cy="1.02" r="1.02" />
        <circle cx="1252.29" cy="20.41" r="1.02" />
        <circle cx="1281.95" cy="2.76" r="1.02" />
        <circle cx="1480" cy="170.55" r="1.02" />
        <circle cx="1471.38" cy="143.25" r="1.02" />
        <circle cx="1508.73" cy="52.74" r="1.02" />
        <circle cx="1478.56" cy="59.92" r="1.02" />
        <circle cx="1403.14" cy="177.02" r="1.02" />
        <circle cx="1263.29" cy="361.01" r="2.03" />
        <circle cx="1476.62" cy="297.01" r="2.03" />
        <circle cx="1346.59" cy="373.2" r="1.02" />
        <circle cx="1265.33" cy="384.38" r="1.02" />
        <circle cx="1122.03" cy="241" r="1.02" />
        <circle cx="1202.34" cy="280.75" r="1.02" />
        <circle cx="1321.2" cy="211.67" r="1.02" />
        <circle cx="118.75" cy="150.23" r="1.02" />
        <circle cx="110.13" cy="122.93" r="1.02" />
        <circle cx="147.49" cy="32.42" r="1.02" />
        <circle cx="117.32" cy="39.6" r="1.02" />
        <circle cx="41.89" cy="156.7" r="1.02" />
        <circle cx="145.86" cy="157.82" r="2.03" />
        <circle cx="359.19" cy="93.82" r="2.03" />
        <circle cx="229.16" cy="170.01" r="1.02" />
        <circle cx="147.89" cy="181.19" r="1.02" />
        <circle cx="4.59" cy="37.81" r="1.02" />
        <circle cx="84.9" cy="77.56" r="1.02" />
        <circle cx="203.76" cy="8.48" r="1.02" />
        <circle cx="1295.8" cy="198.46" r="1.02" />
        <circle cx="1258.21" cy="108.04" r="1.02" />
        <circle cx="1241.96" cy="134.46" r="1.02" />
        <circle cx="1031.62" cy="118.07" r="1.02" />
        <circle cx="270.57" cy="454.82" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="629.34" cy="739.82" r="2.03" />
        <circle cx="62.49" cy="519.37" r="2.03" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="206.74" cy="75.4" r="2.03" />
        <circle cx="1344.5" cy="519.37" r="2.03" />
        <circle cx="1293.71" cy="542.73" r="2.03" />
        <circle cx="1058.03" cy="717.47" r="2.03" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="1600.05" cy="662.61" r="1.02" />
        <circle cx="491.18" cy="640.26" r="1.02" />
        <circle cx="32.02" cy="811.95" r="1.02" />
        <circle cx="251.44" cy="51.02" r="1.02" />
        <circle cx="1403.42" cy="531.56" r="2.03" />
        <circle cx="698.42" cy="9.37" r="1.02" />
        <circle cx="1354.39" cy="826.72" r="1.02" />
      </g>
    </g>
  </svg>
)

@view
class HomeHeader {
  render({ isMedium }) {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => {
          console.log('isLarge', isLarge)
          return (
            <Section css={{ background: '#fff' }}>
              <SectionContent padded fullscreen>
                <Slant
                  inverseSlant
                  slantGradient={[
                    Constants.colorSecondary,
                    Constants.colorSecondary.lighten(0.4),
                  ]}
                  slantSize={8}
                  amount={20}
                />
                <Slant slantBackground={`#f6f6f6`} css={{ zIndex: 2 }} />
                <div $$flex />
                <mainSection $smallCallout={!isLarge} $largeCallout={isLarge}>
                  <Title
                    italic
                    size={isMedium ? 5 : 6.2}
                    margin={[-15, 0, -15, -5]}
                    color="#333"
                  >
                    Operate with<br />
                    intelligence
                  </Title>
                  <borderLine />
                  <below css={{ margin: [0, isLarge ? '25%' : 0, 10, 0] }}>
                    <P size={2.2} fontWeight={300} alpha={0.8}>
                      A smart organizational layer for the cloud that lives on
                      your&nbsp;desktop.
                    </P>
                  </below>
                  <actions
                    $$row
                    css={{
                      margin: isLarge ? [25, 'auto', 0, 0] : [20, 0, 0, 0],
                      alignItems: 'center',
                    }}
                  >
                    <UI.Button
                      borderStyle="dotted"
                      borderColor="#ccc"
                      size={1.1}
                      $smallInstallBtn={!isLarge}
                      tooltip=""
                      css={{
                        margin: [0, 10, 0, 0],
                        cursor: 'pointer',
                      }}
                    >
                      Try for{' '}
                      <AppleLogo
                        width={20}
                        height={20}
                        css={{
                          display: 'inline-block',
                          margin: [-2, 0, 0, 0],
                          opacity: 0.32,
                        }}
                      />
                    </UI.Button>
                    <UI.Button
                      chromeless
                      alpha={0.5}
                      onClick={() => Router.go('/features')}
                      margin={[0, 0, 0, 10]}
                      css={{
                        cursor: 'pointer',
                      }}
                    >
                      Learn more
                    </UI.Button>
                  </actions>
                </mainSection>
                <div $$flex />
                <Media
                  query={Constants.screen.large}
                  render={() => (
                    <React.Fragment>
                      <rightSide>
                        <HomeIllustration />
                      </rightSide>
                      <videos if={false}>
                        <videoSpot>
                          <img
                            $girlImg
                            src={girlImg}
                            width={432}
                            css={{ transform: { scale: 0.9 } }}
                          />
                          <UI.Icon
                            name="media-1_button-play"
                            color="#fff"
                            size={45}
                            css={{
                              zIndex: 100,
                              position: 'absolute',
                              top: 120,
                              left: 200,
                            }}
                          />
                          <P selectable={false} size={4.5} margin={0}>
                            Watch the 30s<br /> introduction
                          </P>
                        </videoSpot>
                      </videos>
                    </React.Fragment>
                  )}
                />
              </SectionContent>
            </Section>
          )
        }}
      </Media>
    )
  }

  static style = {
    mainSection: {
      position: 'relative',
      zIndex: 10,
    },
    smallCallout: {
      padding: [0, 0, 40, 0],
    },
    largeCallout: {
      width: '54%',
      margin: [-15, 0, 0, 0],
    },
    borderLine: {
      margin: [30, 40, 20],
      width: '53%',
      height: 4,
      background: '#ddd',
      opacity: 0.15,
    },
    smallInstallBtn: {
      // transform: {
      //   scale: 1.2,
      // },
    },
    videoSpot: {
      cursor: 'pointer',
      flexFlow: 'row',
      alignItems: 'center',
      transformOrigin: 'center center',
      transform: { scale: 0.22 },
      transition: 'all linear 100ms',
      '&:hover': { transform: { scale: 0.23 } },
    },
    girlImg: {
      margin: [0, 60, 0, 0],
      boxShadow: [[0, 0, 90, [0, 0, 0, 0.1]]],
    },
    brandMark: {
      alignSelf: 'flex-end',
      alignItems: 'center',
      textAlign: 'center',
      marginRight: 20,
    },
    title: {
      fontSize: 40,
    },
    small: {
      fontSize: 14,
      fontWeight: 300,
    },
    rightSide: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: '50%',
      pointerEvents: 'none',
    },
    videos: {
      position: 'absolute',
      top: -22,
      right: 100,
      width: 200,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      [Constants.screen.smallQuery]: {
        position: 'relative',
        width: 'auto',
      },
    },
  }
}

const blackBg = UI.color('#111')
const blackTheme = {
  background: UI.color('#2A1B38'),
  color: '#f2f2f2',
  subTitleColor: '#eee',
  titleColor: blackBg.darken(0.75).desaturate(0.3),
}

@view
class HomeFooter {
  render() {
    return (
      <UI.Theme theme={blackTheme}>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section
              css={{
                background: `linear-gradient(${
                  blackTheme.background
                }, ${blackTheme.background.darken(0.15).desaturate(0.2)})`,
              }}
              inverse
            >
              <SectionContent padded fullscreen>
                <Slant
                  css={{ zIndex: 1 }}
                  slantSize={12}
                  inverseSlant
                  slantGradient={[
                    blackTheme.background.darken(0.2),
                    blackTheme.background.darken(0.25),
                  ]}
                />
                <Slant
                  slantSize={8}
                  amount={20}
                  slantGradient={[
                    Constants.colorSecondary.darken(0.4),
                    Constants.colorSecondary.darken(0.6),
                  ]}
                />
                <LeftSide css={{ textAlign: 'left' }}>
                  <div css={{ height: '22%' }} />
                  <below css={{ margin: [15, '5%', 0, 0] }}>
                    <P2 size={3} alpha={1} fontWeight={200}>
                      We live and work through our&nbsp;technology.
                    </P2>
                    <br />
                    <P2 size={1.8} alpha={0.85}>
                      The services that power your life and work are diverse.
                      Making sense of them will require handling much of your
                      sensitive data. It has to be done{' '}
                      <strong>completely privately, on device</strong>.
                    </P2>
                    <P2 size={1.8} alpha={0.85}>
                      Orbit does this. It's always at hand. That means we need
                      to deliver a truly great experience.
                    </P2>
                    <br />
                    <P2 size={1.3} alpha={0.85}>
                      Learn about how we approach{' '}
                      <SubLink>privacy & experience</SubLink>.
                    </P2>
                  </below>
                </LeftSide>
                <RightSide noEdge $$centered>
                  <Join />
                </RightSide>
              </SectionContent>
            </Section>
          )}
        </Media>
      </UI.Theme>
    )
  }
}

export default () => (
  <Media query={Constants.screen.medium}>
    {isMedium => (
      <React.Fragment>
        <Header />
        <HomeHeader isMedium={isMedium} />
        <HomeFooter isMedium={isMedium} />
      </React.Fragment>
    )}
  </Media>
)
