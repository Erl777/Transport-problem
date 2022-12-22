<template>
  <div class="output">
    <header>
      <div class="row title">
        <span>Доставка</span>
        <span>Разгрузка</span>
      </div>
      <div class="row subtitles">
        <span>Пункт отправления</span>
        <span>Кол-во</span>
        <span>Пункт назначения</span>
        <span>Кол-во</span>
      </div>
    </header>
    <div class="row"
       v-for="supplier in suppliersGrouping"
       :key="supplier.name"
    >

      <div>
        <span class="bordered"> {{ supplier.name }} </span>
      </div>
      <span> {{ supplier.count }} </span>
      <template v-for="recipient in supplier.recipients">
        <div class="recipient" :class="recipient.class">
          <span class="bordered"> {{ recipient.name }} </span>
        </div>
        <span :class="recipient.class"> {{ recipient.count }} </span>
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
  computed: {
    suppliersGrouping() {
      return this.suppliers.reduce((result, supplier) => {

        const recipients = this.config.filter(item => item.supplier === supplier.name)
            .map(elem => (
                {
                  name: elem.recipient,
                  count: elem.count,
                  class: elem.recipient === 'fictitious' ? 'hidden' : ''
                }
            ))
        result.push({
          name: supplier.name,
          count: supplier.count,
          recipients
        })

        return result
      }, [])
    }
  }
}
</script>

<style lang="scss" scoped>
$grid-columns: 100px 100px minmax(100px, 1fr) 100px 100px;

.output {
  padding: 10px;
  border-radius: 10px;
  background-color: #FFFFFF;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.18);
}

.row {
  display: grid;
  grid-template-columns: $grid-columns;
  padding: 24px 0 18px 0;
  border-bottom: 1px solid #d5d5d5;
  column-gap: 10px;
  row-gap: 10px;

  > span {
    margin: auto 0;
  }

  &.title {
    border-bottom: none;
    grid-template-columns: $grid-columns;
    padding-bottom: 18px;
    padding-top: 12px;

    span:first-child, span:last-child {
      grid-column-start: span 2;
    }

    span:last-child {
      grid-column: 4/5 span;
    }
  }

  &:last-child {
    padding-bottom: 8px;
    border: none;
  }
}

.subtitles {
  padding-bottom: 14px;
  padding-top: 0;
  font-size: 12px;
  color: #929292;

  & span:nth-child(3) {
    grid-column: 4;
  }
}

.bordered {
  display: inline-block;
  padding: 5px;
  background-color: #dedede;
  border-radius: 4px;
}

.recipient {
  grid-column: 4;
}

.total {
  grid-column: 3;
  text-align: center;
}
</style>