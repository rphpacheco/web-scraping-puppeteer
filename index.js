const puppeteer = require('puppeteer'),
    fs = require('fs-extra');

(async function main() {
    try {
        const browser = await puppeteer.launch({ headless : true })
        const page = await browser.newPage()
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36')

        await page.goto('https://experts.shopify.com/')
        await page.waitForSelector('.section')
        const sections = await page.$$('.section')

        await fs.writeFile('out.csv', 'section,name\n')

        for(i = 0; i < sections.length; i++) {

            await page.goto('https://experts.shopify.com/')
            await page.waitForSelector('.section')
            const sections = await page.$$('.section')

            const section = sections[i]
            const button = await section.$('a.marketing-button')
            const buttonName = await page.evaluate(button => button.innerText, button)
            console.log('\n\n')
            console.log('button', buttonName)
            button.click()

            await page.waitForSelector('#ExpertsResults')
            const lis = await page.$$('#ExpertsResults > li')

            for( const li of lis) {
                const name = await li.$eval('h2', h2 => h2.innerText)
                console.log('name', name)
                await fs.appendFile('out.csv', `"${buttonName}","${name}"\n`)
            }

        }

        console.log('done \\o/')
        browser.close()

    } catch (e) {
        console.log(`expected : ${ e }`)
    }
})()