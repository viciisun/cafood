const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    // 创建默认管理员
    const adminPassword = await hash('admin123', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            username: 'admin',
            password: adminPassword,
            role: 'ADMIN',
        },
    })

    // 创建测试用户
    const userPassword = await hash('vicii123', 12)
    const user = await prisma.user.upsert({
        where: { email: 'viciisun@gmail.com' },
        update: {},
        create: {
            email: 'viciisun@gmail.com',
            username: 'viciisun',
            password: userPassword,
            role: 'USER',
        },
    })

    // 创建默认商店
    const shops = [
        {
            name: 'Bar Tottis',
            type: 'CAFE',
            address: '123 Coffee Street, City',
            latitude: 31.2304,
            longitude: 121.4737,
            description: '一个安静舒适的咖啡馆，提供精品咖啡和手工甜点。',
            images: JSON.stringify(['/images/shops/default/cafe/cafe-1.jpg']),
            priceLevel: 2,
            userId: admin.id
        },
        {
            name: 'Chop House',
            type: 'RESTAURANT',
            address: '456 Food Avenue, City',
            latitude: 31.2297,
            longitude: 121.4762,
            description: '提供精致的本地和国际美食，环境优雅。',
            images: JSON.stringify(['/images/shops/default/restaurant/restaurant-1.jpg']),
            priceLevel: 3,
            userId: admin.id
        },
        {
            name: '桂林螺蛳粉',
            type: 'FASTFOOD',
            address: '789 Fast Lane, City',
            latitude: 31.2290,
            longitude: 121.4750,
            description: '快速美味的食物，适合忙碌的都市人。',
            images: JSON.stringify(['/images/shops/default/fastfood/fastfood-1.jpg']),
            priceLevel: 1,
            userId: admin.id
        },
        {
            name: 'Kazan',
            type: 'FASTFOOD',
            address: '789 Fast Lane, City',
            latitude: 31.2290,
            longitude: 121.4750,
            description: '快速美味的食物，适合忙碌的都市人。',
            images: JSON.stringify(['/images/shops/default/fastfood/fastfood-1.jpg']),
            priceLevel: 1,
            userId: admin.id
        },
        {
            name: '兰州拉面',
            type: 'FASTFOOD',
            address: '789 Fast Lane, City',
            latitude: 31.2290,
            longitude: 121.4750,
            description: '快速美味的食物，适合忙碌的都市人。',
            images: JSON.stringify(['/images/shops/default/fastfood/fastfood-1.jpg']),
            priceLevel: 1,
            userId: admin.id
        },
        {
            name: '小巷',
            type: 'FASTFOOD',
            address: '789 Fast Lane, City',
            latitude: 31.2290,
            longitude: 121.4750,
            description: '快速美味的食物，适合忙碌的都市人。',
            images: JSON.stringify(['/images/shops/default/fastfood/fastfood-1.jpg']),
            priceLevel: 1,
            userId: admin.id
        },
        {
            name: 'Cabana Bar',
            type: 'FASTFOOD',
            address: '789 Fast Lane, City',
            latitude: 31.2290,
            longitude: 121.4750,
            description: '快速美味的食物，适合忙碌的都市人。',
            images: JSON.stringify(['/images/shops/default/fastfood/fastfood-1.jpg']),
            priceLevel: 1,
            userId: admin.id
        }
    ]

    // 创建或更新商店
    for (const shop of shops) {
        await prisma.shop.upsert({
            where: {
                name_userId: {
                    name: shop.name,
                    userId: shop.userId
                }
            },
            update: shop,
            create: shop
        })
    }

    console.log('Seeding completed')
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })