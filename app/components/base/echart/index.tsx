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
  const echartInstance = useRef<echarts.ECharts | null>(null)

  const hasPie = React.useMemo(() => {
    return Array.isArray(option.series) && option.series.some((s: any) => s.type === 'pie')
  }, [option])

  const cleanedOption = React.useMemo(() => {
    const opt = { ...option }
    if (hasPie) {
      // 对于 pie chart，移除坐标系配置
      delete opt.xAxis
      delete opt.yAxis
      // 确保 series data 有效，并修复无效 emphasis
      if (Array.isArray(opt.series)) {
        opt.series = opt.series.map((s: any) => {
          const cleanedS = { ...s }
          if (s.emphasis === 'max') {
            // 移除无效 emphasis 'max' for pie
            delete cleanedS.emphasis
          }
          cleanedS.data = Array.isArray(s.data) ? s.data.filter((d: any) => typeof d === 'object' && d !== null && typeof d.value === 'number' && typeof d.name === 'string') : []
          return cleanedS
        })
      }
    }
    return opt
  }, [option, hasPie])

  const tooltipFormatter = React.useCallback((params: any) => {
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
  }, [t])

  useEffect(() => {
    if (!chartRef.current)
      return

    // 初始化 chart 实例（仅首次）
    if (!echartInstance.current)
      echartInstance.current = echarts.init(chartRef.current)

    const chart = echartInstance.current

    // 安全检查：确保 cleanedOption 有效
    if (typeof cleanedOption === 'object' && cleanedOption !== null && Array.isArray(cleanedOption.series) && cleanedOption.series.every((s: any) => typeof s === 'object' && s !== null && typeof s.type === 'string')) {
      try {
        chart.setOption({
          ...cleanedOption,
          tooltip: {
            ...(cleanedOption.tooltip || {}),
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
        chart.resize()
      }
      catch (error) {
        console.error('ECharts setOption 失败:', error)
        // 可选：设置默认空 option
        chart.setOption({})
      }
    }
    else {
      // 如果无效，设置空 option 或跳过
      console.warn('无效的 ECharts option，跳过 setOption')
    }

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    const resizeObserver = new ResizeObserver(() => {
      chart.resize()
    })
    resizeObserver.observe(chartRef.current)

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
      // 不 dispose，除非组件卸载
    }
  }, [cleanedOption, hasPie, tooltipFormatter])

  useEffect(() => {
    return () => {
      if (echartInstance.current) {
        echartInstance.current.dispose()
        echartInstance.current = null
      }
    }
  }, [])

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
