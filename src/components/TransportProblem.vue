<template>
  <div class="container">

    <div class="table">

      <div
          class="table__row"
          v-for="row in matrix"
          :class="row[0].class"
      >
        <template v-for="cell in row">

          <div
              v-if="cell.name !== undefined"
              class="cell" :class="cell.class">
            <div class="cell__part center">
              <input class="cell__input" type="text" v-model.number="cell.name">
            </div>
            <div class="cell__part center">
              <input class="cell__input" type="text" v-model.number="cell.count">
            </div>
          </div>

          <div
              v-else
              class="cell center" :class="cell.class">
            <input class="cell__input" type="text" v-model.number="cell.price">
          </div>

        </template>
      </div>

      <span class="prompt-top"> Потребители </span>
      <span class="prompt-left"> Производители </span>

    </div>

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
      <button class="btn-white" @click="convertingMatrixIntoConfig">solve</button>
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

const GLP_MIN = 1; // направление поиска

const GLP_FX = 5; // фиксированное значение эквивалентно знаку =

export default {
  name: "TransportProblem",
  components: { TransportProblemOutput },
  data() {
    return {
      matrix: [
          [{name: '', count: 0}, {name: 'B1', count: 220}, {name: 'B2', count: 150}, {name: 'B3', count: 250}, {name: 'B4', count: 180}],
          [{name: 'A1', count: 300}, { price: 4}, { price: 5}, { price: 3}, { price: 6}],
          [{name: 'A2', count: 250}, { price: 7}, { price: 2}, { price: 1}, { price: 5}],
          [{name: 'A3', count: 200}, { price: 6}, { price: 1}, { price: 4}, { price: 2}],
          //[{name: 'A4', count: 50}, { price: 0}, { price: 0}, { price: 0}, { price: 0}],
      ],
      isClosed: undefined, // индикатор который показывает является ли матрица закрытой
      added: '', // записываю, что было добавленно. строка или столбец, чтобы потом удалить
      output: [],
      outputReady: false,
      total: 0
    }
  },
  methods: {
    addRow() {
      const rowLength = this.matrix[0].length
      let row = Array(rowLength)
      for(let i = 0; i < rowLength; i++) {
        i === 0 ? row[i] = {name: '', count: 0} : row[i] = { price: 0 }
      }
      this.matrix.push(row)
    },
    removeRow() {
      this.matrix = this.matrix.slice(0, this.matrix.length - 1)
    },
    addColumn() {
      this.matrix.forEach((row, index) => {
        index === 0 ? row.push({name: '', count: 0}) : row.push({ price: 0 })
      })
    },
    removeColumn() {
      this.matrix = this.matrix.map((row) => row.slice(0, row.length - 1))
    },

    /**
     * Проверяю является ли матрица закрытой.
     * ( равно ли кол-во производимой продукции кол-ву потребляемой )
     * Если нет, то делаю ее закрытой по средствам
     * добавления фиктивного производителя или потребителя
     */
    matrixIsClosed() {
      const suppliersSum = this.suppliersSum();
      const recipientsSum = this.recipientsSum();
      this.isClosed = suppliersSum === recipientsSum
      if(this.isClosed === false) {
        recipientsSum > suppliersSum ? this.addFictitiousSupplier(recipientsSum - suppliersSum) : this.addFictitiousRecipient(suppliersSum - recipientsSum)
      }
    },

    removeFictitiousItems() {
      if(this.added === 'row') this.removeRow()
      if(this.added === 'column') this.removeColumn()
    },

    recipientsSum() {
      return this.matrix[0].reduce((accum, cell) => {
        accum += cell.count
        return accum
      }, 0)
    },

    suppliersSum() {
      return this.matrix.reduce((accum, row) => {
        accum += row[0].count
        return accum
      }, 0)
    },

    /**
     * Добавляю фиктивного производителя, чтобы сделать
     * матрицу закрытой т.к. библиотека считает
     * только закрытые матрицы. Фиктивный производитель производит
     * недостающее кол-во продукции для потребителей
     * @param count {Number}
     */
    addFictitiousSupplier(count) {
      const rowLength = this.matrix[0].length
      const row = new Array(rowLength)
      row[0] = {
        name: 'Fictitious Supplier',
        count: Math.abs(count),
        class: 'hidden' // скрываю фиктивную строку из таблицы
      }
      for(let i = 1; i < rowLength; i++) {
        row[i] = {
          price: 0
        }
      }
      this.added = 'row'
      this.matrix.push(row)
    },
    /**
     * Добавляю фиктивного потребителя, чтобы сделать
     * матрицу закрытой т.к. библиотека считает
     * только закрытые матрицы. Фиктивный потребитель потребляет
     * недостающее кол-во продукции которые изготавливают производители
     * @param count {Number}
     */
    addFictitiousRecipient(count) {
      this.matrix.forEach((row, i) => {
        if(i === 0) {
          row.push({
            name: 'fictitious',
            count: Math.abs(count),
            class: 'hidden'
          })
        }
        else {
          row.push({
            price: 0,
            class: 'hidden'
          })
        }
      })
      this.added = 'column'
    },

    /**
     * Конвертирую матрицу в конфиг, который нужен для библиотеки
     * @returns {Promise<void>}
     */
    async convertingMatrixIntoConfig() {
      this.matrixIsClosed()
      const config = {
        name: 'config',
        objective: {
          direction: GLP_MIN,
          name: 'main function',
          vars: this.mainFunction(this.matrix)
        },
        subjectTo: this.functionRestrictions(this.matrix)
      }
      const glpk = await GLPK()
      const result = await glpk.solve(config)
      this.convertingResultIntoMatrix(result.result)
    },
    /**
     * Формируется главная функция, которая будет в дальнейшем решаться
     * @param matrix {Array}
     * @returns {Array}
     */
    mainFunction(matrix) {
      let varIndex = 1;
      return matrix.reduce((result, row, index) => {
        if(index > 0) {
          row.forEach((cell, i) => {
            if( i > 0 ) {
              result.push({ name: `x${varIndex}`, coef: Number(cell.price) })
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
      let restrictionNum = 1;
      let varNum = 0;

      const rowRestrictions = matrix.reduce((result, row, index) => {
        if( index > 0 ) {
          result.push({
            name: `restriction${restrictionNum}`,
            vars: rowVars(row),
            bnds: { type: GLP_FX, ub: row[0].count, lb: row[0].count }
          })
          restrictionNum++
        }
        return result
      }, [])

      function rowVars(row) {
        return row.map((item, i) => {
          if(i > 0) {
            varNum++;
            return {
              name: `x${varNum}`,
              coef: 1
            };
          }
        }).filter(n => n !== undefined)
      }

      const columnRestrictions = matrix[0].reduce((result, cell, index) => {
        if( index > 0 ) {
          result.push({
            name: `restriction${restrictionNum}`,
            vars: columnVars.call(this, index),
            bnds: { type: GLP_FX, ub: cell.count, lb: cell.count }
          })
          restrictionNum++
        }
        return result
      }, [])

      function columnVars(i) {
        let varNum = i;
        const columnsNum = this.matrix[0].length - 1
        return this.matrix.reduce((result, row, index) => {
          if(index > 0) {
            result.push({
              name: `x${varNum}`,
              coef: 1
            })
            varNum+= columnsNum;
          }
          return result
        }, [])
      }

      return [...rowRestrictions, ...columnRestrictions]
    },

    /**
     * Преобразую ответ от библиотеки в формат матрицы
     * @param vars
     * @param z
     */
    convertingResultIntoMatrix({vars, z}) {
      this.total = z
      let resultArr = Object.values(vars)
      const columnNum = this.matrix[0].length - 1;
      let matrix = []
      let startPoint = 0;
      let endPoint = columnNum;

      for(let i = 0; i < columnNum; i++) {
        matrix.push(resultArr.slice(startPoint, endPoint))
        startPoint+= columnNum
        endPoint+= columnNum
      }

      this.preparationForOutput(matrix)
      this.outputReady = true
    },

    /**
     * Формирую массив ячеек с данными для
     * дальнейшего вывода
     * @param matrix {Array}
     */
    preparationForOutput(matrix) {
      this.output = matrix.reduce((result, row, index) => {
        row.forEach((cell, i) => {
          if(cell > 0) result.push(this.getCellExtremePoints(index + 1, i + 1, cell))
        })
        return result
      }, [])
      if(this.isClosed === false) this.removeFictitiousItems()
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
        from: this.matrix[rowIndex][0].name,
        to: this.matrix[0][colIndex].name,
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
      return this.matrix.map(row => row[0]).filter(n => n.name !== '' && n.name !== 'Fictitious Supplier')
    }
  }
}
</script>

<style scoped>
  .container {
    /*width: 100%;*/
    padding: 10px;
    background-color: #f6f6f6;
  }
  .table {
    position: relative;
    display: inline-block;
    background-color: #FFFFFF;
    margin: 20px 0 0 20px;
  }
  .table__row {
    display: flex;
  }
  .cell {
    width: 100px;
    height: 100px;
    border: 1px solid;
    text-align: center;
  }
  .table .table__row:first-child .cell:first-child:first-child {
    position: relative;
  }
  .table .table__row:first-child .cell:first-child:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    height: 100px;
    background-color: #fff;
  }
  .cell__part {
    display: block;
    height: 50%;
  }
  .cell__part:first-child {
    border-bottom: 1px solid;
  }
  .cell__input {
    max-width: 100%;
    text-align: center;
    padding: 0;
    border: none;
  }
  .buttons-container {
    margin: 10px 0;
  }
  .btn-white {
    display: inline-block;
    min-width: 100px;
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
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .prompt-top {
    position: absolute;
    left: 50%;
    top: -20px;
    transform: translateX(-50%);
  }
  .prompt-left {
    position: absolute;
    top: 50%;
    left: -10px;
    transform: translateX(-50%) rotate(-90deg);
  }
</style>