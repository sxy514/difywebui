import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import * as echarts from 'echarts/core'

import {
  BarChart,
  CustomChart,
  FunnelChart,
  GaugeChart,
  LineChart,
  MapChart,
  ParallelChart,
  PieChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
} from 'echarts/charts'

import {
  DataZoomComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent,
} from 'echarts/components'

import { CanvasRenderer } from 'echarts/renderers'

import { use } from 'echarts/core'

import styles from './style.module.css'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  FunnelChart,
  GaugeChart,
  ParallelChart,
  SankeyChart,
  CustomChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
])

type EChartProps = {
  option: echarts.EChartsCoreOption
  style?: React.CSSProperties
  className?: string
}

const EChart: React.FC<EChartProps> = ({ option, style, className = '' }) => {
  const { t } = useTranslation()
  const chartRef = useRef<HTMLDivElement>(null)

  const hasPie = React.useMemo(() => {
    return option.series?.some((s: any) => s.type === 'pie')
  }, [option])

  const tooltipFormatter = (params: any) => {
    let html = '<div class="echart-tooltip">'
    if (Array.isArray(params) && params.length > 0) {
      // axis trigger, 多series
      params.forEach((param: any) => {
        const value = param.value ?? param.value[1] ?? 0
        html += `
          <div class="echart-tooltip-item">
            <span style="display:inline-block;margin-right:4px;width:10px;height:10px;border-radius:50%;background-color:${param.color};"></span>
            ${param.seriesName}: ${value}
          </div>
        `
      })
    }
    else {
      // item trigger, 如pie
      const param = params
      const value = param.value ?? 0
      html += `
        <div class="echart-tooltip-header">
          ${param.name}
        </div>
        <div class="echart-tooltip-value">
          ${t('chart.value')}: ${value}
        </div>
      `
    }
    html += '</div>'
    return html
  }

  useEffect(() => {
    if (!chartRef.current)
      return

    const chart = echarts.init(chartRef.current)
    chart.setOption({
      ...option,
      tooltip: {
        ...option.tooltip,
        trigger: hasPie ? 'item' : 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: tooltipFormatter,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#eee',
        textStyle: {
          color: '#333',
        },
      },
    })
    chart.resize() // 确保初始尺寸正确

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    const resizeObserver = new ResizeObserver(() => {
      chart.resize()
    })
    resizeObserver.observe(chartRef.current)

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
      chart.dispose()
    }
  }, [option, hasPie, tooltipFormatter])

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
