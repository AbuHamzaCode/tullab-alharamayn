    const { sequelize, User, Role, Playlist, Lesson, Author, AuthorLesson } = require('./models');

    (async () => {
        try {
            await sequelize.sync({ force: true }); // Drops and recreates tables

            // Create demo roles
            const [adminRole, userRole] = await Role.bulkCreate([
                { name: 'Admin' },
                { name: 'User' }
            ]);

            // Create demo users
            const [abuHamza, abuAmina] = await User.bulkCreate([
                { fullName: "Abu Hamza", email: "abuhamza@gmail.com", password: '12345678', username: 'abuhamza' },
                { fullName: "Abu Amina", email: "abuamina@gmail.com", password: '12345678', username: 'abuamina' }
            ]);

            await abuHamza.addRole(adminRole);
            await abuAmina.addRole(userRole);

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
                tags: "#test, #tauhid, #osnova",
                playlistId: playlist1.id
            });
            const lesson2 = await Lesson.create({
                title: "Test Lesson 2",
                description: "description for test lesson-> here you can write about lesson 2",
                tags: "#test, #tauhid, #osnova",
                playlistId: playlist1.id
            });
            const lesson3 = await Lesson.create({
                title: "Test Lesson 3",
                description: "description for test lesson-> here you can write about lesson 3",
                tags: "#osnova",
                playlistId: playlist2.id
            });

            // Create demo authors
            const author1 = await Author.create({
                fullName: 'Abu Amina At Tivaki',
                email: "abuaminaattivaki@gmail.com",
                diploma: "Medina University",
                tags: "#akida, #fikh",
            });
            const author2 = await Author.create({
                fullName: "AbdulMumin",
                email: "abdulmumin@gmail.com",
                diploma: "Medina University",
                tags: "#akida, #fikh",
            });

            // Associate lessons with authors
            await lesson1.addAuthors([author1, author2]);
            await lesson2.addAuthors([author2]);
            await lesson3.addAuthors([author1]);

            console.log('Demo data and relationships have been inserted.');

        } catch (error) {
            console.error('Error seeding data:', error);
        } finally {
            await sequelize.close(); // Close the database connection
        }
    })();
