<template>
  <div class="container">

    <p class="prompt-top"> Потребители </p>
    <table class="table">
      <template v-for="row in matrix">
        <tr :class="row[0].class">
          <template v-for="cell in row">
            <td
                v-if="cell.name !== undefined"
                class="cell"
            >
              <input class="cell__input" type="text" v-model="cell.name">
            </td>
            <td
                v-if="cell.price >= 0"
                class="cell"
                rowspan="2"
            >
              <input class="cell__input" type="text" v-model.number="cell.price">
            </td>
          </template>
        </tr>
        <tr :class="row[0].class">
          <template v-for="cell in row">
            <td
                v-if="cell.count >= 0"
                class="cell"
            >
              <input class="cell__input" type="text" v-model.number="cell.count">
            </td>
          </template>
        </tr>
      </template>
    </table>

    <div class="buttons-container">
      <button class="btn-white" @click="addColumn">
        добавить колонку
      </button>
      <button class="btn-white" @click="removeColumn">
        удалить колонку
      </button>
      <button class="btn-white" @click="addRow">
        добавить строку
      </button>
      <button class="btn-white" @click="removeRow">
        удалить строку
      </button>
      <button class="btn-white" @click="startAlgorithm">solve</button>
    </div>
    <TransportProblemOutput
        v-if="outputReady"
        :config="output"
        :suppliers="matrixRowsNames"
        :total="total"
    />
  </div>
</template>

<script>
import TransportProblemOutput from "@/components/TransportProblemOutput";
import GLPK from 'glpk.js'
//const glpk = await GLPK().then(res => { return res })
import { clone } from 'lodash'

const GLP_MIN = 1; // направление поиска

const GLP_FX = 5; // фиксированное значение эквивалентно знаку =

const fictitiousItemTitle = (count) => {
  return {
    name: 'fictitious',
    count: Math.abs(count),
    class: 'hidden' // скрываю фиктивную строку из таблицы
  }
}

const fictitiousItemCell = {
  price: 0,
  class: 'hidden'
}

export default {
  name: "TransportProblem",
  components: {TransportProblemOutput},
  data() {
    return {
      matrix: [
        [{name: '', count: 0}, {name: 'B1', count: 220}, {name: 'B2', count: 150}, {name: 'B3', count: 250}, {name: 'B4', count: 180}],
        [{name: 'A1', count: 300}, {price: 4}, {price: 5}, {price: 3}, {price: 6}],
        [{name: 'A2', count: 250}, {price: 7}, {price: 2}, {price: 1}, {price: 5}],
        [{name: 'A3', count: 200}, {price: 6}, {price: 1}, {price: 4}, {price: 2}],
        //[{name: 'A4', count: 50}, { price: 0}, { price: 0}, { price: 0}, { price: 0}],
      ],
      added: '', // записываю, что было добавленно. строка или столбец, чтобы потом удалить
      output: [],
      outputReady: false,
      total: 0
    }
  },
  methods: {
    addRow() {
      const example = this.matrix[0]
      let row = Array.from({length: example.length}, (elem, i) => {
        return i === 0 ? elem = {name: '', count: 0} : elem = {price: 0}
      })
      this.matrix.push(row)
    },
    removeRow() {
      this.matrix.pop()
    },
    addColumn() {
      this.matrix.forEach((row, index) => {
        index === 0 ? row.push({name: '', count: 0}) : row.push({price: 0})
      })
    },
    removeColumn() {
      this.matrix.forEach((row) => row.pop())
    },

    /**
     * Проверяю является ли матрица закрытой.
     * ( равно ли кол-во производимой продукции кол-ву потребляемой )
     * Если нет, то делаю ее закрытой по средствам
     * добавления фиктивного производителя или потребителя
     */
    addFictitiousElem() {
      this.recipientsSum > this.suppliersSum ? this.addFictitiousSupplier() : this.addFictitiousRecipient()
    },

    removeFictitiousItems() {
      if (this.added === 'row') this.removeRow()
      if (this.added === 'column') this.removeColumn()
    },

    /**
     * Добавляю фиктивного производителя, чтобы сделать
     * матрицу закрытой т.к. библиотека считает
     * только закрытые матрицы. Фиктивный производитель производит
     * недостающее кол-во продукции для потребителей
     */
    addFictitiousSupplier() {
      const count = this.recipientsSum - this.suppliersSum;
      const example = this.matrix[0]
      const row = Array.from({length: example.length}, (elem, i) => {
        return i === 0 ? elem = fictitiousItemTitle(count) : elem = fictitiousItemCell
      })
      this.added = 'row'
      this.matrix.push(row)
    },
    /**
     * Добавляю фиктивного потребителя, чтобы сделать
     * матрицу закрытой т.к. библиотека считает
     * только закрытые матрицы. Фиктивный потребитель потребляет
     * недостающее кол-во продукции которые изготавливают производители
     */
    addFictitiousRecipient() {
      const count = this.suppliersSum - this.recipientsSum
      this.matrix.forEach((row, i) => {
        i === 0 ? row.push(fictitiousItemTitle(count)) : row.push(fictitiousItemCell)
      })
      this.added = 'column'
    },

    async startAlgorithm() {
      if (this.isClosed === false) this.addFictitiousElem()
      const config = this.convertingMatrixIntoConfig()
      const glpk = await GLPK()
      const {result} = await glpk.solve(config)
      const matrix = this.convertingResultIntoMatrix(result)
      this.preparationForOutput(matrix)
    },

    /**
     * Конвертирую матрицу в конфиг, который нужен для библиотеки
     * @returns {Promise<void>}
     */
    convertingMatrixIntoConfig() {
      return {
        name: 'config',
        objective: {
          direction: GLP_MIN,
          name: 'main function',
          vars: this.mainFunction(this.matrix)
        },
        subjectTo: this.functionRestrictions(this.matrix)
      }
    },
    /**
     * Формируется главная функция, которая будет в дальнейшем решаться
     * @param matrix {Array}
     * @returns {Array}
     */
    mainFunction(matrix) {
      let varIndex = 1;
      return matrix.reduce((result, row, index) => {
        if (index > 0) {
          row.forEach((cell, i) => {
            if (i > 0) {
              result.push({name: `x${varIndex}`, coef: Number(cell.price)})
              varIndex++
            }
          })
        }
        return result
      }, [])
    },

    /**
     * Формируются ограничения для главной функции
     * @param matrix {Array}
     * @returns {*[]}
     */
    functionRestrictions(matrix) {
      let varIndex = 0;

      const restriction = (cell, index, func) => ({
        name: `restriction${index}`,
        vars: func,
        bnds: {type: GLP_FX, ub: cell.count, lb: cell.count}
      })

      const variable = (index) => ({
        name: `x${index}`,
        coef: 1
      })

      function rowVars(index) {
        return matrix[index].map((item, i) => {
          if (i > 0) {
            varIndex++;
            return variable(varIndex);
          }
        }).filter(n => n !== undefined)
      }

      function columnVars(i) {
        let varIndex = i + 1;
        const step = matrix[0].length - 1
        return matrix.reduce((result, row, index) => {
          if (index > 0) {
            result.push(variable(varIndex))
            varIndex += step;
          }
          return result
        }, [])
      }

      function restrictions(arr, func) {
        return arr.reduce((accum, cell, index) => {
          accum.push(restriction(cell, index, func(index)))
          return accum
        }, [])
      }
      const rowRestrictions2 = restrictions(this.suppliersData, rowVars)
      const columnRestrictions2 = restrictions(this.recipientsData, columnVars)

      return [...rowRestrictions2, ...columnRestrictions2]
    },

    /**
     * Преобразую ответ от библиотеки в формат матрицы
     * @param data {Object}
     */
    convertingResultIntoMatrix(data) {
      this.total = data.z
      let resultArr = Object.values(data.vars)
      const step = this.matrix[0].length - 1;
      let matrix = []
      let startPoint = 0;
      let endPoint = step;

      for (let i = 0; i < step; i++) {
        matrix.push(resultArr.slice(startPoint, endPoint))
        startPoint += step
        endPoint += step
      }
      return matrix
    },

    /**
     * Формирую массив ячеек с данными для
     * дальнейшего вывода
     * @param matrix {Array}
     */
    preparationForOutput(matrix) {
      this.output = matrix.reduce((result, row, index) => {
        row.forEach((cell, i) => {
          if (cell > 0) result.push(this.getCellExtremePoints(index + 1, i + 1, cell))
        })
        return result
      }, [])
      if (this.isClosed === false) this.removeFictitiousItems()
      this.outputReady = true
    },

    /**
     * Получаю пороизводителя и потребителя для нужной ячейки
     * из матрицы с распределением
     * @param rowIndex {Number}
     * @param colIndex {Number}
     * @param count {Number}
     * @returns {{count, from, to: (string|*)}}
     */
    getCellExtremePoints(rowIndex, colIndex, count) {
      return {
        supplier: this.matrix[rowIndex][0].name,
        recipient: this.matrix[0][colIndex].name,
        count
      }
    },
  },
  computed: {
    /**
     * Формирую список поставщиков для вывода в таблицу
     * @returns {*[]}
     */
    matrixRowsNames() {
      return this.matrix.map(row => row[0]).filter(n => n.name !== '' && n.name !== 'fictitious')
    },
    isClosed() {
      return this.suppliersSum === this.recipientsSum
    },
    recipientsSum() {
      const recipients = this.matrix[0]
      return recipients.reduce((accum, cell) => {
        accum += cell.count
        return accum
      }, 0)
    },
    suppliersSum() {
      return this.matrix.reduce((accum, row) => {
        const supplier = row[0]
        accum += supplier.count
        return accum
      }, 0)
    },
    recipientsData() {
      let recipients = clone(this.matrix[0])
      recipients.shift()
      return recipients
    },
    suppliersData() {
      return this.matrix.map((row, i) => {
        if(i > 0) return row[0]
      }).filter(n => n !== undefined)
    }
  }
}
</script>

<style scoped>
.container {
  padding: 10px;
  background-color: #f6f6f6;
}

.table {
  position: relative;
  margin: 0 auto 10px;
  border-collapse: collapse;
  background-color: #FFFFFF;
}

.table tr:nth-child(-n+2) td:first-child {
  opacity: 0;
  pointer-events: none;
  border: unset;
}

.table:before {
  content: 'Производители';
  position: absolute;
  top: 50%;
  left: -10px;
  transform: translateX(-50%) rotate(-90deg);
}

.cell {
  width: 100px;
  max-width: 100px;
  height: 50px;
  border: 1px solid;
  text-align: center;
  padding: 0;
}

.cell__input {
  max-width: 100%;
  text-align: center;
  padding: 0;
  border: none;
}

.buttons-container {
  margin: 0 0 10px;
}

.btn-white {
  display: inline-block;
  min-width: 120px;
  height: 28px;
  padding: 0;
  text-align: center;
  font-family: "Roboto Regular", sans-serif;
  background-color: #fff;
  box-sizing: border-box;
  font-size: 13px;
  border: 1px solid #DBDBDB;
  border-radius: 14px;
}

.btn-white:hover {
  cursor: pointer;
}

.prompt-top {
  margin: 0;
}

.hidden {
  display: none;
}

</style>