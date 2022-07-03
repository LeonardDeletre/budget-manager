import { useColors } from 'vuestic-ui'

function colorToRgba(color: string, a: number) {
  const { shiftHSLAColor } = useColors()

  // TODO: replace with set hsla color
  // https://github.com/epicmaxco/vuestic-ui/issues/841
  const transparentColor = shiftHSLAColor(color, { a: -1 })
  return shiftHSLAColor(transparentColor, { a })
}

const generateYLabels = () => {
  return ['Expenses', 'Entries']
}



export const getLineChartData = (themes: ColorThemes, firstMonth: number,  dict: {[key: string]: number[]}) => {
  const firstMonthIndex = 0
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const yLabels = generateYLabels()

  const generatedData = {
    labels: months.splice(firstMonthIndex),
    datasets: [
      {
        label: yLabels[0],
        backgroundColor: colorToRgba(themes.danger, 0.6),
        borderColor: 'transparent',
        data: dict['expensesSum']
      },
      {
        label: yLabels[1],
        backgroundColor: colorToRgba(themes.info, 0.6),
        borderColor: 'transparent',
        data: dict['entriesSum']
      },
    ],
  }

  return generatedData
}
