/*
 * Copyright © 2017 The Blocky Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable import/no-unresolved, import/default */

/* eslint-enable import/no-unresolved, import/default */

/* eslint-disable angular/angularelement */

/*@ngInject*/
export default function ExamplesController($mdSidenav, store, $state) {
    var vm = this;

    vm.isSidenavOpen = true;
    vm.examples = [{
            id: 'blink',
            name: 'Blink',
            xmlCode: {
                "name": "Blink Example",
                "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables><variable type=\"\" id=\"h]!#yQnySY}}W|4+7ZbV\">ledOn<\/variable><\/variables><block type=\"io_pin_mode\" id=\"VE0.w4w/X39h@{X8o?s.\" x=\"163\" y=\"100\"><field name=\"pin\">4<\/field><field name=\"mode\">OUTPUT<\/field><next><block type=\"variables_set\" id=\"4@p1=0W^K)07Is;dryL^\"><field name=\"VAR\" id=\"h]!#yQnySY}}W|4+7ZbV\" variabletype=\"\">ledOn<\/field><value name=\"VALUE\"><block type=\"logic_boolean\" id=\",Nr{sFH.F8:p!#o1~z]a\"><field name=\"BOOL\">TRUE<\/field><\/block><\/value><next><block type=\"timer_event\" id=\"H@cljrY:o)]9WiUEJN]H\"><field name=\"when\">tmr.ALARM_AUTO<\/field><field name=\"time\">1000<\/field><statement name=\"handler\"><block type=\"variables_set\" id=\"$v87@(O66PLHq(c5OT%x\"><field name=\"VAR\" id=\"h]!#yQnySY}}W|4+7ZbV\" variabletype=\"\">ledOn<\/field><value name=\"VALUE\"><block type=\"logic_negate\" id=\"K~ZW)~`qZo#j*Z@CnVZL\"><value name=\"BOOL\"><block type=\"variables_get\" id=\"tYDNQJB60o?6fJeN[kOL\"><field name=\"VAR\" id=\"h]!#yQnySY}}W|4+7ZbV\" variabletype=\"\">ledOn<\/field><\/block><\/value><\/block><\/value><next><block type=\"controls_if\" id=\"Y5!T@teI]z_Ae79_YIPz\"><mutation else=\"1\"><\/mutation><value name=\"IF0\"><block type=\"variables_get\" id=\"O$OQqX1,0daF5cZzb@Mk\"><field name=\"VAR\" id=\"h]!#yQnySY}}W|4+7ZbV\" variabletype=\"\">ledOn<\/field><\/block><\/value><statement name=\"DO0\"><block type=\"io_digital_write\" id=\"1j}DdRjaFM8EPMIAt4_b\"><field name=\"pin\">4<\/field><field name=\"value\">LOW<\/field><\/block><\/statement><statement name=\"ELSE\"><block type=\"io_digital_write\" id=\"r5_.?/p,j;*3=,N1s6^7\"><field name=\"pin\">4<\/field><field name=\"value\">HIGH<\/field><\/block><\/statement><\/block><\/next><\/block><\/statement><\/block><\/next><\/block><\/next><\/block><\/xml>",
                "lua": "gpio.mode(4, gpio.OUTPUT)\nledOn = true\ntmr.create():alarm(1000, tmr.ALARM_AUTO, function()\n  ledOn = not ledOn\n  if ledOn then\n    gpio.write(4, gpio.LOW)\n  else\n    gpio.write(4, gpio.HIGH)\n  end\n\nend)\n",
                "mode": "block"
            }
        },
        {
            id: 'button',
            name: 'Button',
            xmlCode: {
                "name": "Button Example",
                "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables><variable type=\"\" id=\"2i@QX$!8{}~QHLAd#FdT\">ledOn<\/variable><\/variables><block type=\"io_pin_mode\" id=\"*mld?sKg.d.I5X2DZd_M\" x=\"113\" y=\"38\"><field name=\"pin\">4<\/field><field name=\"mode\">OUTPUT<\/field><next><block type=\"io_pin_mode\" id=\"U8S{FaLr,$Q:it[Ym-ko\"><field name=\"pin\">5<\/field><field name=\"mode\">INT<\/field><next><block type=\"variables_set\" id=\"B#Tvn}xsYT{_cun+N`~I\"><field name=\"VAR\" id=\"2i@QX$!8{}~QHLAd#FdT\" variabletype=\"\">ledOn<\/field><value name=\"VALUE\"><block type=\"logic_boolean\" id=\"Y8~VH5@pz59Uw0!ij#D_\"><field name=\"BOOL\">FALSE<\/field><\/block><\/value><next><block type=\"io_digital_write\" id=\"Mb`}*!|QyS:4NF7B0%*y\"><field name=\"pin\">4<\/field><field name=\"value\">HIGH<\/field><next><block type=\"io_pin_event\" id=\"1)~Nx2y#}IDVZGP84om$\"><field name=\"pin\">5<\/field><field name=\"value\">up<\/field><statement name=\"handler\"><block type=\"variables_set\" id=\"08mgz?yUVI.xhG5I^H$^\"><field name=\"VAR\" id=\"2i@QX$!8{}~QHLAd#FdT\" variabletype=\"\">ledOn<\/field><value name=\"VALUE\"><block type=\"logic_negate\" id=\"LUx1*UFb}HcdurmtJ.}V\"><value name=\"BOOL\"><block type=\"variables_get\" id=\"`Y~AO;dCP%A@0z=*oDfK\"><field name=\"VAR\" id=\"2i@QX$!8{}~QHLAd#FdT\" variabletype=\"\">ledOn<\/field><\/block><\/value><\/block><\/value><next><block type=\"controls_if\" id=\"uE2PoZxU3v4gm65XJEP0\"><mutation else=\"1\"><\/mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"ie]T/if_6eW.~C8]#euz\"><field name=\"OP\">EQ<\/field><value name=\"A\"><block type=\"variables_get\" id=\"z4Z-F@E.4MfmIv(2vJsH\"><field name=\"VAR\" id=\"2i@QX$!8{}~QHLAd#FdT\" variabletype=\"\">ledOn<\/field><\/block><\/value><value name=\"B\"><block type=\"logic_boolean\" id=\"(#tDW8-5zKi(2xk4P5us\"><field name=\"BOOL\">TRUE<\/field><\/block><\/value><\/block><\/value><statement name=\"DO0\"><block type=\"io_digital_write\" id=\"zb;n/_e(zsh90SVn?Lhn\"><field name=\"pin\">4<\/field><field name=\"value\">LOW<\/field><\/block><\/statement><statement name=\"ELSE\"><block type=\"io_digital_write\" id=\"2to[m3;W8MG*9ypOUikK\"><field name=\"pin\">4<\/field><field name=\"value\">HIGH<\/field><\/block><\/statement><\/block><\/next><\/block><\/statement><\/block><\/next><\/block><\/next><\/block><\/next><\/block><\/next><\/block><\/xml>",
                "lua": "gpio.mode(4, gpio.OUTPUT)\ngpio.mode(5, gpio.INT)\nledOn = false\ngpio.write(4, gpio.HIGH)\ngpio.trig(5, \"up\", function(level)\n  ledOn = not ledOn\n  if ledOn == true then\n    gpio.write(4, gpio.LOW)\n  else\n    gpio.write(4, gpio.HIGH)\n  end\n\nend)\n",
                "mode": "block"
            }
        },
        {
            id: 'relay',
            name: 'Relay',
            xmlCode: {
                "name": "Relay Example",
                "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables><variable type=\"\" id=\";?Gw+`m.Lg!EgkL.F9[h\">relayOn<\/variable><\/variables><block type=\"io_pin_mode\" id=\"q#DO{(!]_Ea-xB6IqJ;4\" x=\"138\" y=\"38\"><field name=\"pin\">5<\/field><field name=\"mode\">INPUT<\/field><next><block type=\"variables_set\" id=\"_-ijXQ~1VGEg/Hd?dP8X\"><field name=\"VAR\" id=\";?Gw+`m.Lg!EgkL.F9[h\" variabletype=\"\">relayOn<\/field><value name=\"VALUE\"><block type=\"logic_boolean\" id=\"_ezmQjkJauB(M,nYxIdE\"><field name=\"BOOL\">FALSE<\/field><\/block><\/value><next><block type=\"timer_event\" id=\"C-]sL=-$f35+.)p3ojo/\"><field name=\"when\">tmr.ALARM_AUTO<\/field><field name=\"time\">1000<\/field><statement name=\"handler\"><block type=\"variables_set\" id=\"+z=JG%qu-tQ.!SiM_g+)\"><field name=\"VAR\" id=\";?Gw+`m.Lg!EgkL.F9[h\" variabletype=\"\">relayOn<\/field><value name=\"VALUE\"><block type=\"logic_negate\" id=\"L9z3V#QQoI[iC(rGA+7}\"><value name=\"BOOL\"><block type=\"variables_get\" id=\"bL:x};67HEtLYg9%3ha@\"><field name=\"VAR\" id=\";?Gw+`m.Lg!EgkL.F9[h\" variabletype=\"\">relayOn<\/field><\/block><\/value><\/block><\/value><next><block type=\"controls_if\" id=\"Z_[ZE#_Z_$M.!PkXY|;o\"><mutation else=\"1\"><\/mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"^K?=btw3ew*O(9RZoGSa\"><field name=\"OP\">EQ<\/field><value name=\"A\"><block type=\"variables_get\" id=\"VgjnDC(bB2xPA?}4*]tY\"><field name=\"VAR\" id=\";?Gw+`m.Lg!EgkL.F9[h\" variabletype=\"\">relayOn<\/field><\/block><\/value><value name=\"B\"><block type=\"logic_boolean\" id=\"SL,dez4=^8ph|Z%XUzc*\"><field name=\"BOOL\">TRUE<\/field><\/block><\/value><\/block><\/value><statement name=\"DO0\"><block type=\"io_digital_write\" id=\"qkDnm3L~mmw!Q0il=^kw\"><field name=\"pin\">5<\/field><field name=\"value\">HIGH<\/field><\/block><\/statement><statement name=\"ELSE\"><block type=\"io_digital_write\" id=\"m%xhGG8ba+[WYzM^/R3K\"><field name=\"pin\">5<\/field><field name=\"value\">LOW<\/field><\/block><\/statement><\/block><\/next><\/block><\/statement><\/block><\/next><\/block><\/next><\/block><\/xml>",
                "lua": "gpio.mode(5, gpio.INPUT)\nrelayOn = false\ntmr.create():alarm(1000, tmr.ALARM_AUTO, function()\n  relayOn = not relayOn\n  if relayOn == true then\n    gpio.write(5, gpio.HIGH)\n  else\n    gpio.write(5, gpio.LOW)\n  end\n\nend)\n",
                "mode": "block"
            }
        }
    ];
    vm.selected = vm.examples[0];


    vm.viewExample = viewExample;
    vm.toggleExamplesList = toggleExamplesList;
    vm.useExample = useExample;

    function viewExample(example) {
        $mdSidenav('examples-list').close();
        vm.selected = example;
    }

    function useExample() {
        store.set('script', vm.selected.xmlCode);
        $state.go('home.codelab', {
            reload: true
        });
    }

    function toggleExamplesList() {
        $mdSidenav('examples-list').toggle();
    }

}