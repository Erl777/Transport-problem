<template>
  <div class="table-output">
    <header>
      <div class="row title">
        <span class="width200p" >Доставка</span>
        <span></span>
        <span class="width200p" >Разгрузка</span>
      </div>
      <div class="row subtitles">
        <span class="column-title">Пункт отправления</span>
        <span class="column-title">Кол-во</span>
        <span></span>
        <span class="column-title">Пункт назначения</span>
        <span class="column-title">Кол-во</span>
      </div>
    </header>
    <div class="row" v-for="item in suppliersGrouping()">

      <div>
        <span class="point"> {{ item.from }} </span>
      </div>
      <span class="vertical-align-center"> {{ item.full }} </span>
      <span class=""></span>
      <template v-for="recipient in item.recipients">
        <div class="recipient-point" :class="recipient.class">
          <span class="point"> {{ recipient.to }} </span>
        </div>
        <span class="vertical-align-center" :class="recipient.class"> {{ recipient.count }} </span>
      </template>

    </div>
    <div class="row">
      <span class="total"> Результат: {{ total }} </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TransportProblemOutput",
  props: {
    config: {
      type: Array,
      required: true
    },
    suppliers: {
      type: Array,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  methods: {
    suppliersGrouping() {
      return this.suppliers.reduce((result, supplier) => {

        const arr = this.config.filter(item => item.from === supplier.name)
        try {
          result.push({
            from: supplier.name,
            full: supplier.count,
            recipients: arr.map(elem => {
              return {
                to: elem.to,
                count: elem.count,
                class: elem.to === 'fictitious' ? 'hidden' : ''
              }
            })
          })
        } catch (e) {
          throw new Error(e)
        }

        return result
      }, [])
    }
  }
}
</script>

<style lang="scss" scoped>

.table-output {
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: #FFFFFF;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.18);
}
.row {
  display: grid;
  grid-template-columns: 100px 100px minmax(100px, 1fr) 100px 100px;;
  padding: 24px 0 18px 0;
  border-bottom: 1px solid #d5d5d5;
  column-gap: 10px;
  row-gap: 10px;
  &.title {
    border-bottom: none;
    grid-template-columns: 100px 100px minmax(100px, 1fr) 100px 100px;
    padding-bottom: 18px;
    padding-top: 12px;
    .width200p {
      grid-column-start: span 2;
    }
  }
  &.subtitles {
    padding-bottom: 14px;
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 8px;
    border: none;
  }
}
.point {
  display: inline-block;
  padding: 5px;
  background-color: #dedede;
  border-radius: 4px;
}
.vertical-align-center {
  margin: auto 0;
}
.column-title {
  font-size: 12px;
  margin-top: auto;
  color: #929292;
}
.recipient-point {
  grid-column: 4;
}
.total {
  grid-column: 3;
  text-align: center;
}
</style>