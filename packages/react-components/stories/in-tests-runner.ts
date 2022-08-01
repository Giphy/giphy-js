const inTestsRunner = () => {
    return process.env.NODE_ENV === 'PERCY' || (typeof window !== 'undefined' && !!(window as any).Cypress)
}
export default inTestsRunner
