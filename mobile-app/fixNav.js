const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // 1. Bottom nav with label
      content = content.replace(
        /<Pressable style=\{styles\.tabItem\}>\s*<User size=\{\d+\} color="[^"]+" \/>\s*<Text style=\{styles\.tabText\}>PROFILE<\/Text>\s*<\/Pressable>/g,
        `<Pressable style={styles.tabItem} onPress={() => router.push('/profile')}>
          <User size={22} color="#6b7280" />
          <Text style={styles.tabText}>PROFILE</Text>
        </Pressable>`
      );

      // 2. Bottom nav without label (like search, mock exams etc)
      content = content.replace(
        /<Pressable style=\{styles\.tabItem\}>\s*<User size=\{\d+\} color="[^"]+" \/>\s*<\/Pressable>/g,
        `<Pressable style={styles.tabItem} onPress={() => router.push('/profile')}>
          <User size={22} color="#6b7280" />
        </Pressable>`
      );

      // 3. Subscription top right profile pic
      content = content.replace(
        /<View style=\{styles\.headerRight\}>\s*<Text style=\{styles\.headerProText\}>Pro<\/Text>\s*<Image \s*source=\{\{ uri: 'https:\/\/i\.pravatar\.cc\/150\?img=11' \}\} \s*style=\{styles\.profilePic\} \s*\/>\s*<\/View>/g,
        `<View style={styles.headerRight}>
            <Text style={styles.headerProText}>Pro</Text>
            <Pressable onPress={() => router.push('/profile')}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.profilePic} />
            </Pressable>
          </View>`
      );

      // 4. Other pages top right profile pic (without Pressable wrapper)
      // Be careful not to wrap things already in Pressable.
      // Usually it's:
      // <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.profilePic} />
      // NOT preceded by <Pressable ... >
      // Let's use a simpler safe approach:
      if (!content.includes(`onPress={() => router.push('/profile')}>\n            <Image`)) {
          content = content.replace(
              /(\s*)<Image\s*source=\{\{\s*uri:\s*'https:\/\/i\.pravatar\.cc\/150\?img=(11|12)'\s*\}\}\s*style=\{styles\.profilePic\}\s*\/>/g,
              (match, spaces, imgNum) => {
                // if it's already inside something we don't want to double wrap,
                // but we know in dashboard.tsx it's just <Image ... />
                return `${spaces}<Pressable onPress={() => router.push('/profile')}>${spaces}  <Image source={{ uri: 'https://i.pravatar.cc/150?img=${imgNum}' }} style={styles.profilePic} />${spaces}</Pressable>`;
              }
          );
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated navigation references in: ${file}`);
      }
    }
  }
}

processDir(appDir);
