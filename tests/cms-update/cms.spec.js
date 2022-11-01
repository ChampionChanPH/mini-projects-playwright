const { test, expect } = require('@playwright/test')
const login = require("../../common/common-details.json")

test.use({
    storageState: 'resources/authStateCMS.json'
})

const data = [
]

test.describe('tests done in CMS', async () => {
    // user successfully login to the CMS via email and password
    test('successful user login via email and password', async ({ page }) => {
        await page.goto(`https://cms.connect.prosple.com/`)
        await page.fill("input[name=email]", login.cms.email)
        await page.fill("input[name=password]", login.cms.password)
        await Promise.all([
            page.waitForNavigation(),
            page.click("span.auth0-label-submit")
        ])
        await page.locator("a.toolbar-icon-user").waitFor()
        await page.context().storageState({ path: 'resources/authStateCMS.json' })
    })

    test('expire courses', async ({ page }) => {
        for (let index = 0; index < data.length; index++) {
            let url = `${data[index]}`
            console.log(`${index}\t${url}`)
            await page.goto(url)
            const expired = await page.locator("//div[@class='field__label' and text()='Expired']/following-sibling::*").innerText()
            if (expired === "No") {
                url = `${data[index]}/edit`
                await page.goto(url)
                await page.locator("summary[aria-controls=edit-group-b]").click()
                await page.locator("label[for=edit-field-expired-value]").click()
                await page.locator("input#edit-submit").click()
                await page.locator("div.messages.messages--status").waitFor()
            }
        }
    })

    test('unexpire courses', async ({ page }) => {
        for (let index = 0; index < data.length; index++) {
            let url = `${data[index]}`
            console.log(`${index}\t${url}`)
            await page.goto(url)
            const expired = await page.locator("//div[@class='field__label' and text()='Expired']/following-sibling::*").innerText()
            if (expired === "Yes") {
                url = `${data[index]}/edit`
                await page.goto(url)
                await page.locator("summary[aria-controls=edit-group-b]").click()
                await page.locator("label[for=edit-field-expired-value]").click()
                await page.locator("input#edit-submit").click()
                await page.locator("div.messages.messages--status").waitFor()
            }
        }
    })

    test('expire scholarships', async ({ page }) => {
        for (let index = 0; index < data.length; index++) {
            let url = `${data[index]}`
            console.log(`${index} ${url}`)
            await page.goto(url)
            const expired = await page.locator("//div[@class='field__label' and text()='Expired']/following-sibling::*").innerText()
            if (expired === "No") {
                url = `${data[index]}/edit`
                await page.goto(url)
                await page.locator("summary[aria-controls=edit-group-basic-details]").click()
                await page.locator("label[for=edit-field-expired-value]").click()
                await page.locator("input#edit-submit").click()
                await page.locator("div.messages.messages--status").waitFor()
            }
        }
    })

    test('update apply url to include alchemer form', async ({ page }) => {
        for (let index = 0; index < data.length; index++) {
            const url = `${data[index]}/edit`
            console.log(`${index}\t${url}`)
            await page.goto(url)
            const prefixUrl = "https://forms.prosple.com/s3/student-information?link="
            const sourceUrl = await page.locator("input[data-drupal-selector=edit-field-record-source-url-0-uri]").inputValue()
            const domesticApplyUrl = await page.locator("input[data-drupal-selector=edit-field-dom-apply-by-url-0-uri]").inputValue()
            const internationalApplyUrl = await page.locator("input[data-drupal-selector=edit-field-int-apply-by-url-0-uri]").inputValue()
            const destinationUrl = sourceUrl !== "" ? sourceUrl.replace(/https?:\/\//, "") : domesticApplyUrl.replace(/https?:\/\//, "")
            const courseName = await page.locator("input[data-drupal-selector=edit-title-0-value]").inputValue()
            const encodedCourse = encodeURIComponent(courseName)
            let institutionName = await page.locator("input[data-drupal-selector=edit-field-parent-institution-0-target-id]").inputValue()
            institutionName = institutionName.replace(/ \(\d+\)$/, "").trim()
            const encodedInstitution = encodeURIComponent(institutionName)
            const new_url = `${prefixUrl}${destinationUrl}&institution=${encodedInstitution}&course=${encodedCourse}`
            await page.locator("summary[aria-controls=edit-group-apply]").click()
            await page.locator("input[data-drupal-selector=edit-field-dom-apply-by-url-0-uri]").fill(new_url)
            if (internationalApplyUrl !== "") await page.locator("input[data-drupal-selector=edit-field-int-apply-by-url-0-uri]").fill(new_url)
            await page.locator("input#edit-submit").click()
            await page.locator("div.messages.messages--status").waitFor()
        }
    })
})