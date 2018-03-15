<template>

</template>

<script>
  import G6 from '@antv/g6';
  import Plugins from '@antv/g6-plugins';
  import {debounce} from 'lodash'

  G6.track(false);

  const plugin = new Plugins['layout.dagre']({
    rankdir: 'LR',
    nodesep: 100,
    ranksep: 100,
  });


  export default {
    name: "FlowChart",
    props: ['dom_id', 'data'],
    data() {
      return {
        net: null
      };
    },
    computed: {},
    mounted() {
      console.log(this.dom_id);
      this.setChart(this.dom_id);
      window.onresize = debounce(() => {
        this.net.refresh();
      }, 50);
    },
    beforeDestroy: function () {

    },
    methods: {
      setChart(id) {
        const data = {
          "nodes": [
            {
              "shape": "rect",
              "label": "流程b1",
              "id": "e4d76a7f"
            },
            {
              "shape": "rect",
              "label": "流程a1",
              "id": "f1484ff9"
            },
            {
              "shape": "rect",
              "label": "开始",
              "id": "827c30fc"
            },
            {
              "shape": "rect",
              "label": "结束",
              "id": "6ca66cc0"
            },
            {
              "shape": "rect",
              "label": "流程a3",
              "id": "c06c2256"
            },
            {
              "shape": "rect",
              "label": "流程b2",
              "id": "1de16a07"
            },
            {
              "shape": "rect",
              "label": "流程a2",
              "id": "3b63e239"
            }
          ],
          "edges": [
            {
              "source": "827c30fc",
              "target": "e4d76a7f",
              "id": "52eaf313"
            },
            {
              "source": "827c30fc",
              "target": "f1484ff9",
              "id": "66daf43b"
            },
            {
              "source": "e4d76a7f",
              "target": "1de16a07",
              "id": "e5c4e030"
            },
            {
              "source": "f1484ff9",
              "target": "3b63e239",
              "id": "7ccbcdac"
            },
            {
              "source": "1de16a07",
              "target": "6ca66cc0",
              "id": "5fca64c8"
            },
            {
              "source": "3b63e239",
              "target": "1de16a07",
              "id": "0afb7710"
            },
            {
              "source": "f1484ff9",
              "target": "c06c2256",
              "id": "c511e9b6"
            },
            {
              "source": "c06c2256",
              "target": "6ca66cc0",
              "id": "e558b462"
            }
          ]
        };

        this.net = new G6.Net({
          id: id,
          width: document.querySelector(`#${this.dom_id}`).getBoundingClientRect().width,
          height: document.querySelector(`#${this.dom_id}`).getBoundingClientRect().height,
          fitView: 'autoZoom',
          plugins: [plugin]
        });
        this.net.source(data.nodes, data.edges);
        this.net.edge().shape('arrow');
        this.net.render();
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
