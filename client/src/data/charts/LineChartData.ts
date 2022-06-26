import { useColors } from 'vuestic-ui'

function colorToRgba(color: string, a: number) {
  const { shiftHSLAColor } = useColors()

  // TODO: replace with set hsla color
  // https://github.com/epicmaxco/vuestic-ui/issues/841
  const transparentColor = shiftHSLAColor(color, { a: -1 })
  return shiftHSLAColor(transparentColor, { a })
}

const generateYLabels = () => {
  return ['Debit', 'Credit']
}

let generatedData: GeneratedData
let firstMonthIndex = 0

export const getLineChartData = (themes: ColorThemes, firstMonth: number,  dict: {[key: string]: number[]}) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const yLabels = generateYLabels()

  if (generatedData) {
    generatedData.datasets[0].backgroundColor = colorToRgba(themes.danger, 0.6)
    generatedData.datasets[1].backgroundColor = colorToRgba(themes.info, 0.6)
    if (firstMonth && firstMonthIndex !== firstMonth) {
      generatedData.labels.shift()
      generatedData.datasets.forEach((dataset) => {
        dataset.data = dataset.data.slice(1)
      })
      firstMonthIndex = firstMonth
    }
  } else {
    generatedData = {
      labels: months.splice(firstMonthIndex),
      datasets: [
        {
          label: yLabels[0],
          backgroundColor: colorToRgba(themes.danger, 0.6),
          borderColor: 'transparent',
          data: dict['expensesAvg']
        },
        {
          label: yLabels[1],
          backgroundColor: colorToRgba(themes.info, 0.6),
          borderColor: 'transparent',
          data: dict['entriesAvg']
        },
      ],
    }
  }

  return generatedData
}
