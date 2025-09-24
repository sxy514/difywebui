import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import styles from './style.module.css'

type EChartProps = {
  option: echarts.EChartsCoreOption
  style?: React.CSSProperties
  className?: string
}

const EChart: React.FC<EChartProps> = ({ option, style, className = '' }) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current)
      return

    const chart = echarts.init(chartRef.current)
    chart.setOption({
      ...option,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const [firstParam] = params
          return `
            <div class="echart-tooltip">
              <div class="echart-tooltip-header">
                name: ${firstParam.name}<br/>
              </div>
              <div class="echart-tooltip-value">
                value: ${firstParam.value}
              </div>
            </div>
          `
        },
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#eee',
        textStyle: {
          color: '#333',
        },
      },
    })

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [option])

  return (
    <div
      ref={chartRef}
      className={styles.echartContainer}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  )
}

export default EChart
