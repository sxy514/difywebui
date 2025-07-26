import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

type EChartProps = {
    option: echarts.EChartsOption
    style?: React.CSSProperties
}

const EChart: React.FC<EChartProps> = ({ option, style }) => {
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
            <div style="margin: 0 0 4px 0;font-weight:500">
              name: ${firstParam.name}<br/>
              value: ${firstParam.value}
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
            style={{ width: '100%', height: '400px', ...style }}
        />
    )
}

export default EChart
