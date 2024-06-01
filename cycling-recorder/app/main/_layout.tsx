import React from 'react';
import { Tabs } from 'expo-router';

export default function Layout() {
    return (
      <Tabs>
        <Tabs.Screen name="record" options={{ headerShown: false }} />
        <Tabs.Screen name="profile" options={{ headerShown: false }} />
      </Tabs>
    );
  }