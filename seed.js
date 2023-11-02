const { sequelize, User, Role, Playlist, Lesson, Author, AuthorLesson, Tag } = require('./models');
const bcrypt = require('bcrypt');

(async () => {
    try {
        await sequelize.sync({ force: true }); // Drops and recreates tables

        // Create demo roles
        const [adminRole, userRole] = await Role.bulkCreate([
            { name: 'Admin' },
            { name: 'User' }
        ]);
        const hashedPassword = await bcrypt.hash("password", 10);

        // Create demo users
        const [abuHamza, abuAmina] = await User.bulkCreate([
            { fullName: "Abu Hamza", email: "abuhamza@gmail.com", password: hashedPassword, username: 'abuhamza' },
            { fullName: "Abu Amina", email: "abuamina@gmail.com", password: hashedPassword, username: 'abuamina' }
        ]);

        // Create demo authors
        const [tag1, tag2, tag3] = await Tag.bulkCreate([
            { name: 'Akyda' },
            { name: 'Fikh' }, { name: 'Usul' }
        ]);

        // Create demo playlists
        const playlist1 = await Playlist.create({
            title: "Test Playlist 1",
            description: "description for test playlist-> here you can write about playlist",
            tags: "#test, #tauhid, #osnova"
        });
        const playlist2 = await Playlist.create({
            title: "Test Playlist 2",
            description: "here you can write about playlist",
            tags: "#test"
        });

        // Create demo lessons
        const lesson1 = await Lesson.create({
            title: "Test Lesson 1",
            description: "description for test lesson-> here you can write about lesson 1 ",
            playlistId: playlist1.id
        });
        const lesson2 = await Lesson.create({
            title: "Test Lesson 2",
            description: "description for test lesson-> here you can write about lesson 2",
            playlistId: playlist1.id
        });
        const lesson3 = await Lesson.create({
            title: "Test Lesson 3",
            description: "description for test lesson-> here you can write about lesson 3",
            playlistId: playlist2.id
        });

        // Create demo authors
        const author1 = await Author.create({
            fullName: 'Abu Amina At Tivaki',
            email: "abuaminaattivaki@gmail.com",
            diploma: "Medina University",
        });
        const author2 = await Author.create({
            fullName: "AbdulMumin",
            email: "abdulmumin@gmail.com",
            diploma: "Medina University",
        });


        // Associate users with role
        await abuHamza.addRole(adminRole);
        await abuAmina.addRole(userRole);

        // Associate users with role
        await playlist1.addTags([tag1, tag3]);
        await playlist2.addTags([tag2]);

        // Associate authors with tags
        await author1.addTags([tag1, tag2]);
        await author2.addTags([tag3]);

        // Associate lessons with authors & tags
        await lesson1.addAuthors([author1, author2]);
        await lesson1.addTags([tag1, tag3]);

        await lesson2.addAuthors([author2]);
        await lesson2.addTags([tag1, tag2]);

        await lesson3.addAuthors([author1]);
        await lesson3.addTags([tag2]);



        console.log('Demo data and relationships have been inserted.');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await sequelize.close(); // Close the database connection
    }
})();
