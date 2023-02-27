import typescript from 'rollup-plugin-typescript2'

export default {
    input: 'src/index.ts',
    output: [
        {
            name: 'GiphyEmbed',
            file: 'dist/umd/index.js',
            format: 'umd',
        },
        {
            file: 'dist/index.js',
            format: 'commonjs',
        },
    ],
    plugins: [
        typescript({
            tsconfig: 'tsconfig.json',
        }),
    ],
}
